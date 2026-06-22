<?php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Config\Database;
use PDO;
use Exception;

class RentalController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAll(Request $request, Response $response): Response {
        try {
            $query = "SELECT r.*, c.name as customer_name, car.brand as car_brand, car.name as car_model, 
                             b.status as booking_status,
                             (SELECT status FROM payments WHERE booking_id = b.id ORDER BY created_at DESC LIMIT 1) as payment_status
                      FROM rentals r
                      JOIN bookings b ON r.booking_id = b.id
                      JOIN customers c ON b.customer_id = c.id
                      JOIN cars car ON b.car_id = car.id
                      ORDER BY r.created_at DESC";
            
            $stmt = $this->db->query($query);
            $rentals = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $formatted = array_map([$this, 'formatRental'], $rentals);
            return $this->jsonResponse($response, $formatted);

        } catch (Exception $e) {
            return $this->jsonResponse($response, ["message" => "Fetch failed: " . $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, Response $response, array $args): Response {
        $id = intval($args['id']);
        $data = json_decode($request->getBody()->getContents(), true);
        $status = $data['status'] ?? ''; // 'booked' | 'ongoing' | 'completed'

        if (!in_array($status, ['booked', 'ongoing', 'completed'])) {
            return $this->jsonResponse($response, ["message" => "Invalid rental status"], 400);
        }

        try {
            $this->db->beginTransaction();

            // Fetch current rental details with booking and payment status
            $stmt = $this->db->prepare("SELECT r.*, b.car_id, b.status as booking_status, b.id as booking_id, 
                                        (SELECT status FROM payments WHERE booking_id = b.id ORDER BY created_at DESC LIMIT 1) as payment_status 
                                        FROM rentals r 
                                        JOIN bookings b ON r.booking_id = b.id 
                                        WHERE r.id = :id");
            $stmt->execute([':id' => $id]);
            $rental = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$rental) {
                return $this->jsonResponse($response, ["message" => "Rental record not found"], 404);
            }

            // Enforce business logic: only start rental if booking is confirmed and payment is paid
            if ($status === 'ongoing') {
                if ($rental['booking_status'] !== 'confirmed') {
                    return $this->jsonResponse($response, ["message" => "Booking must be confirmed to start rental."], 400);
                }
                if ($rental['payment_status'] !== 'paid') {
                    return $this->jsonResponse($response, ["message" => "Payment must be completed to start rental."], 400);
                }
            }

            // Perform state change actions
            $upRent = $this->db->prepare("UPDATE rentals SET status = :status WHERE id = :id");
            $upRent->execute([':status' => $status, ':id' => $id]);

            if ($status === 'ongoing') {
                // Set booking status to active
                $upBkg = $this->db->prepare("UPDATE bookings SET status = 'active' WHERE id = :booking_id");
                $upBkg->execute([':booking_id' => $rental['booking_id']]);

                // Mark car as unavailable
                $upCar = $this->db->prepare("UPDATE cars SET available = 0 WHERE id = :car_id");
                $upCar->execute([':car_id' => $rental['car_id']]);
            } 
            else if ($status === 'completed') {
                // Set booking status to completed
                $upBkg = $this->db->prepare("UPDATE bookings SET status = 'completed' WHERE id = :booking_id");
                $upBkg->execute([':booking_id' => $rental['booking_id']]);

                // Release the car back to available
                $upCar = $this->db->prepare("UPDATE cars SET available = 1 WHERE id = :car_id");
                $upCar->execute([':car_id' => $rental['car_id']]);
            }

            $this->db->commit();

            return $this->jsonResponse($response, [
                "status" => "success", 
                "message" => "Rental status updated to " . $status,
                "rentalId" => $id,
                "rentalStatus" => $status
            ]);

        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            return $this->jsonResponse($response, ["message" => "Operation failed: " . $e->getMessage()], 500);
        }
    }

    private function formatRental(array $r): array {
        return [
            "id" => $r['id'],
            "bookingId" => $r['booking_id'],
            "customerName" => $r['customer_name'] ?? 'Unknown Customer',
            "carInfo" => ($r['car_brand'] ?? '') . ' ' . ($r['car_model'] ?? 'Unknown Car'),
            "startDate" => $r['pickup_date'],
            "endDate" => $r['return_date'],
            "status" => $r['status'],
            "bookingStatus" => $r['booking_status'] ?? 'pending',
            "paymentStatus" => $r['payment_status'] ?? 'unpaid'
        ];
    }

    private function jsonResponse(Response $response, array $data, int $status = 200): Response {
        $response->getBody()->write(json_encode($data, JSON_PRETTY_PRINT));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}
