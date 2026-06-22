<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Config\Database;
use PDO;
use Exception;

class PaymentController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAll(Request $request, Response $response): Response {
        $user = $request->getAttribute('user');

        try {
            $query = "SELECT p.* FROM payments p 
                      JOIN bookings b ON p.booking_id = b.id";
            $binds = [];

            if ($user->role === 'customer') {
                $query .= " WHERE b.customer_id = :customer_id";
                $binds[':customer_id'] = $user->customerId;
            }

            $query .= " ORDER BY p.date DESC, p.created_at DESC";

            $stmt = $this->db->prepare($query);
            $stmt->execute($binds);
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formatted = array_map([$this, 'formatPayment'], $payments);
            return $this->jsonResponse($response, $formatted);

        } catch (Exception $e) {
            return $this->jsonResponse($response, ["message" => "Fetch failed: " . $e->getMessage()], 500);
        }
    }

    public function create(Request $request, Response $response): Response {
        $user = $request->getAttribute('user');
        $data = json_decode($request->getBody()->getContents(), true);

        $bookingId = $data['bookingId'] ?? '';
        $amount = floatval($data['amount'] ?? 0);
        $method = trim($data['method'] ?? '');
        $details = trim($data['details'] ?? '');

        if (empty($bookingId) || $amount <= 0 || empty($method)) {
            return $this->jsonResponse($response, ["message" => "Invalid payment data"], 400);
        }

        try {
            // Verify booking ownership if customer
            $bkgStmt = $this->db->prepare("SELECT customer_id FROM bookings WHERE id = :id");
            $bkgStmt->execute([':id' => $bookingId]);
            $booking = $bkgStmt->fetch(PDO::FETCH_ASSOC);

            if (!$booking) {
                return $this->jsonResponse($response, ["message" => "Associated booking not found"], 404);
            }

            if ($user->role === 'customer' && intval($booking['customer_id']) !== intval($user->customerId)) {
                return $this->jsonResponse($response, ["message" => "Forbidden: Unauthorized booking transaction"], 403);
            }

            // Generate PAY-xxxx key
            $payId = "PAY-" . rand(1000, 9999);
            $date = date('Y-m-d');

            $stmt = $this->db->prepare("INSERT INTO payments (id, booking_id, amount, method, status, date, details) 
                                        VALUES (:id, :booking_id, :amount, :method, 'pending', :date, :details)");
            
            $stmt->execute([
                ':id' => $payId,
                ':booking_id' => $bookingId,
                ':amount' => $amount,
                ':method' => $method,
                ':date' => $date,
                ':details' => $details
            ]);

            // Fetch created payment
            $getStmt = $this->db->prepare("SELECT * FROM payments WHERE id = :id");
            $getStmt->execute([':id' => $payId]);
            $newPay = $getStmt->fetch(PDO::FETCH_ASSOC);

            return $this->jsonResponse($response, $this->formatPayment($newPay), 201);

        } catch (Exception $e) {
            return $this->jsonResponse($response, ["message" => "Payment failed: " . $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Response $response, array $args): Response {
        $id = $args['id'];
        $data = json_decode($request->getBody()->getContents(), true);
        $user = $request->getAttribute('user');
        
        $status = $data['status'] ?? '';
        $method = trim($data['method'] ?? '');
        $details = trim($data['details'] ?? '');

        try {
            // Fetch existing payment
            $checkStmt = $this->db->prepare("SELECT p.*, b.customer_id FROM payments p JOIN bookings b ON p.booking_id = b.id WHERE p.id = :id");
            $checkStmt->execute([':id' => $id]);
            $existing = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if (!$existing) {
                return $this->jsonResponse($response, ["message" => "Payment not found"], 404);
            }

            // Customer can only update their own pending payments (to submit method/details)
            if ($user->role === 'customer') {
                if (intval($existing['customer_id']) !== intval($user->customerId)) {
                    return $this->jsonResponse($response, ["message" => "Forbidden: Unauthorized access"], 403);
                }
                // Customers can only update method and details on pending payments
                if ($existing['status'] !== 'pending') {
                    return $this->jsonResponse($response, ["message" => "Cannot modify a non-pending payment"], 400);
                }
            } else {
                // Admin can only change status of pending payments
                if (!empty($status) && $existing['status'] !== 'pending') {
                    return $this->jsonResponse($response, ["message" => "Only pending payments can be approved or flagged."], 400);
                }
            }

            // Build dynamic update
            $fields = [];
            $binds = [':id' => $id];

            if (!empty($method)) {
                $fields[] = "method = :method";
                $binds[':method'] = $method;
            }
            if (!empty($details)) {
                $fields[] = "details = :details";
                $binds[':details'] = $details;
            }
            if (!empty($status) && in_array($status, ['paid', 'pending', 'flagged'])) {
                $fields[] = "status = :status";
                $binds[':status'] = $status;
            }

            if (empty($fields)) {
                return $this->jsonResponse($response, ["message" => "Nothing to update"], 400);
            }

            $this->db->beginTransaction();

            $query = "UPDATE payments SET " . implode(", ", $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($query);
            $stmt->execute($binds);

            // Synchronise: If payment is paid, confirm the booking automatically
            if (!empty($status) && $status === 'paid') {
                $syncStmt = $this->db->prepare("UPDATE bookings SET status = 'confirmed' WHERE id = :booking_id AND status = 'pending'");
                $syncStmt->execute([':booking_id' => $existing['booking_id']]);
            }

            $this->db->commit();

            return $this->jsonResponse($response, [
                "status" => "success", 
                "message" => "Payment updated successfully",
                "paymentId" => $id
            ]);

        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            return $this->jsonResponse($response, ["message" => "Operation failed: " . $e->getMessage()], 500);
        }
    }

    private function formatPayment(array $p): array {
        return [
            'id' => $p['id'],
            'bookingId' => $p['booking_id'],
            'amount' => floatval($p['amount']),
            'method' => $p['method'],
            'status' => $p['status'],
            'date' => $p['date'],
            'details' => $p['details'] ?? ''
        ];
    }

    private function jsonResponse(Response $response, array $data, int $status = 200): Response {
        $response->getBody()->write(json_encode($data, JSON_PRETTY_PRINT));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
