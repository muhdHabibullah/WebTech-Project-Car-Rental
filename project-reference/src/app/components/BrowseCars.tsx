import { useState } from 'react';
import { Search, Car as CarIcon } from 'lucide-react';

interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  status: 'available' | 'rented' | 'maintenance';
}

interface BrowseCarsProps {
  cars: Car[];
  onBookCar: (carId: number) => void;
}

export function BrowseCars({ cars, onBookCar }: BrowseCarsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Available Cars</h1>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 flex items-center justify-center">
              <CarIcon className="w-20 h-20 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {car.brand} {car.model}
              </h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-blue-600">RM{car.pricePerDay}</span>
                <span className="text-sm text-gray-600">per day</span>
              </div>
              <div className="mb-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
                    car.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : car.status === 'rented'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}
                >
                  {car.status}
                </span>
              </div>
              <button
                onClick={() => onBookCar(car.id)}
                disabled={car.status !== 'available'}
                className={`w-full py-2 rounded-md transition-colors ${
                  car.status === 'available'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {car.status === 'available' ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
