import { Car, Calendar, DollarSign, Activity } from 'lucide-react';

interface DashboardProps {
  totalCars: number;
  totalBookings: number;
  totalRevenue: number;
  activeRentals: number;
}

export function Dashboard({ totalCars, totalBookings, totalRevenue, activeRentals }: DashboardProps) {
  const stats = [
    { label: 'Total Cars', value: totalCars, icon: Car, color: 'blue' },
    { label: 'Total Bookings', value: totalBookings, icon: Calendar, color: 'green' },
    { label: 'Total Revenue', value: `RM${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'purple' },
    { label: 'Active Rentals', value: activeRentals, icon: Activity, color: 'orange' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-full`}>
                <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
