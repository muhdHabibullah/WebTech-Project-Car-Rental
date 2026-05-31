import { Car, Users, Calendar, CreditCard, Activity, FileText, LayoutDashboard, LogOut } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: 'admin' | 'customer';
  userName: string;
  onLogout: () => void;
}

export function Navigation({ activeTab, onTabChange, userRole, userName, onLogout }: NavigationProps) {
  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cars', label: 'Car Management', icon: Car },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'rentals', label: 'Rentals', icon: Activity },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reports', label: 'Reports & Feedback', icon: FileText },
  ];

  const customerTabs = [
    { id: 'browse', label: 'Browse Cars', icon: Car },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'reports', label: 'Feedback', icon: FileText },
  ];

  const tabs = userRole === 'admin' ? adminTabs : customerTabs;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Car className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">CarRental</span>
            <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {userRole === 'admin' ? 'Admin' : 'Customer'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 border-l border-gray-300 pl-4">
              <span className="text-sm text-gray-700">{userName}</span>
              <button
                onClick={onLogout}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
