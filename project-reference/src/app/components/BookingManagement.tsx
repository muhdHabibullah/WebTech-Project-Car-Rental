import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Booking {
  id: number;
  customerId: number;
  customerName: string;
  carId: number;
  carInfo: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface BookingManagementProps {
  bookings: Booking[];
  customers: any[];
  cars: any[];
  onAddBooking: (booking: Omit<Booking, 'id' | 'customerName' | 'carInfo'>) => void;
  onUpdateBookingStatus: (id: number, status: Booking['status']) => void;
  onCancelBooking: (id: number) => void;
}

export function BookingManagement({
  bookings,
  customers,
  cars,
  onAddBooking,
  onUpdateBookingStatus,
  onCancelBooking,
}: BookingManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: 0,
    carId: 0,
    startDate: '',
    endDate: '',
    totalPrice: 0,
    status: 'pending' as const,
  });

  const calculatePrice = (carId: number, startDate: string, endDate: string) => {
    const car = cars.find((c) => c.id === carId);
    if (!car || !startDate || !endDate) return 0;
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return days * car.pricePerDay;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPrice = calculatePrice(formData.carId, formData.startDate, formData.endDate);
    onAddBooking({ ...formData, totalPrice });
    setFormData({ customerId: 0, carId: 0, startDate: '', endDate: '', totalPrice: 0, status: 'pending' });
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Create New Booking</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value={0}>Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <select
              value={formData.carId}
              onChange={(e) => setFormData({ ...formData, carId: Number(e.target.value) })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            >
              <option value={0}>Select Car</option>
              {cars
                .filter((car) => car.status === 'available')
                .map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} - ${car.pricePerDay}/day
                  </option>
                ))}
            </select>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <div className="md:col-span-2">
              {formData.carId > 0 && formData.startDate && formData.endDate && (
                <p className="text-lg font-semibold text-gray-900">
                  Total Price: ${calculatePrice(formData.carId, formData.startDate, formData.endDate)}
                </p>
              )}
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Create Booking
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Car</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{booking.customerName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.carInfo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.startDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.endDate}</td>
                <td className="px-6 py-4 text-sm text-gray-900">RM{booking.totalPrice}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Confirm
                      </button>
                    )}
                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => onCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
