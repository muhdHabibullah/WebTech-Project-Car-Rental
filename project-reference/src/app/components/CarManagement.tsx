import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Car {
  id: number;
  brand: string;
  model: string;
  pricePerDay: number;
  status: 'available' | 'rented' | 'maintenance';
}

interface CarManagementProps {
  cars: Car[];
  onAddCar: (car: Omit<Car, 'id'>) => void;
  onUpdateCar: (id: number, car: Omit<Car, 'id'>) => void;
  onDeleteCar: (id: number) => void;
}

export function CarManagement({ cars, onAddCar, onUpdateCar, onDeleteCar }: CarManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    pricePerDay: 0,
    status: 'available' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateCar(editingId, formData);
      setEditingId(null);
    } else {
      onAddCar(formData);
    }
    setFormData({ brand: '', model: '', pricePerDay: 0, status: 'available' });
    setShowForm(false);
  };

  const handleEdit = (car: Car) => {
    setFormData({
      brand: car.brand,
      model: car.model,
      pricePerDay: car.pricePerDay,
      status: car.status,
    });
    setEditingId(car.id);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Car
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Car' : 'Add New Car'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Price Per Day"
              value={formData.pricePerDay}
              onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
              className="border border-gray-300 rounded-md px-3 py-2"
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                {editingId ? 'Update' : 'Add'} Car
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ brand: '', model: '', pricePerDay: 0, status: 'available' });
                }}
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
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Brand</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Model</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price/Day</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{car.brand}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{car.model}</td>
                <td className="px-6 py-4 text-sm text-gray-900">RM{car.pricePerDay}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      car.status === 'available'
                        ? 'bg-green-100 text-green-800'
                        : car.status === 'rented'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCar(car.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
