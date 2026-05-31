import { Play, Square } from 'lucide-react';

interface Rental {
  id: number;
  bookingId: number;
  customerName: string;
  carInfo: string;
  startDate: string;
  endDate: string;
  status: 'booked' | 'ongoing' | 'completed';
}

interface RentalProcessingProps {
  rentals: Rental[];
  onStartRental: (id: number) => void;
  onEndRental: (id: number) => void;
}

export function RentalProcessing({ rentals, onStartRental, onEndRental }: RentalProcessingProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Rental Processing</h1>

      <div className="grid grid-cols-1 gap-6">
        {['booked', 'ongoing', 'completed'].map((status) => (
          <div key={status} className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 capitalize">{status} Rentals</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {rentals
                  .filter((rental) => rental.status === status)
                  .map((rental) => (
                    <div
                      key={rental.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{rental.customerName}</h3>
                        <p className="text-sm text-gray-600">{rental.carInfo}</p>
                        <p className="text-sm text-gray-500">
                          {rental.startDate} to {rental.endDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {rental.status === 'booked' && (
                          <button
                            onClick={() => onStartRental(rental.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700"
                          >
                            <Play className="w-4 h-4" />
                            Start Rental
                          </button>
                        )}
                        {rental.status === 'ongoing' && (
                          <button
                            onClick={() => onEndRental(rental.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
                          >
                            <Square className="w-4 h-4" />
                            End Rental
                          </button>
                        )}
                        {rental.status === 'completed' && (
                          <span className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">Completed</span>
                        )}
                      </div>
                    </div>
                  ))}
                {rentals.filter((rental) => rental.status === status).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No {status} rentals</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
