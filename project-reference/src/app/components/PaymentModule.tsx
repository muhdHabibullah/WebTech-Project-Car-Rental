import { CreditCard, DollarSign } from 'lucide-react';

interface Payment {
  id: number;
  bookingId: number;
  customerName: string;
  amount: number;
  method: 'cash' | 'card' | 'online';
  status: 'pending' | 'completed' | 'failed';
  date: string;
}

interface PaymentModuleProps {
  payments: Payment[];
  onProcessPayment: (id: number, method: Payment['method']) => void;
}

export function PaymentModule({ payments, onProcessPayment }: PaymentModuleProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payment Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                RM{payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter((p) => p.status === 'pending').length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {payments.filter((p) => p.status === 'completed').length}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{payment.customerName}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">${payment.amount}</td>
                <td className="px-6 py-4 text-sm text-gray-900 capitalize">{payment.method}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.date}</td>
                <td className="px-6 py-4">
                  {payment.status === 'pending' && (
                    <select
                      onChange={(e) => onProcessPayment(payment.id, e.target.value as any)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Process Payment
                      </option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="online">Online</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
