import { useState } from 'react';
import { Car as CarIcon, Search, LogIn } from 'lucide-react';

interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  status: 'available' | 'rented' | 'maintenance';
}

interface PublicViewProps {
  cars: Car[];
  onLoginClick: () => void;
}

export function PublicView({ cars, onLoginClick }: PublicViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('available');

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || car.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <CarIcon className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">CarRental</span>
            </div>
            <button
              onClick={onLoginClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
            >
              <LogIn className="w-4 h-4" />
              Login / Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect Ride</h1>
          <p className="text-xl mb-8">Rent premium cars at affordable prices</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 border border-gray-200">
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
              <option value="all">All Cars</option>
              <option value="available">Available Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
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
                  onClick={onLoginClick}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login to Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">About Us</h3>
              <p className="text-gray-600 text-sm">
                CarRental provides premium car rental services with a wide selection of vehicles to choose from.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 text-sm">Email: info@carrental.com</p>
              <p className="text-gray-600 text-sm">Phone: +1 (555) 123-4567</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Hours</h3>
              <p className="text-gray-600 text-sm">Mon - Fri: 8:00 AM - 8:00 PM</p>
              <p className="text-gray-600 text-sm">Sat - Sun: 9:00 AM - 6:00 PM</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">&copy; 2026 CarRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
