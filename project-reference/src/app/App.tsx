import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CarManagement } from './components/CarManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { BrowseCars } from './components/BrowseCars';
import { BookingManagement } from './components/BookingManagement';
import { RentalProcessing } from './components/RentalProcessing';
import { PaymentModule } from './components/PaymentModule';
import { ReportsAndFeedback } from './components/ReportsAndFeedback';
import { CustomerFeedback } from './components/CustomerFeedback';
import { AuthModal } from './components/AuthModal';
import { PublicView } from './components/PublicView';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  // Mock Data
  const [cars, setCars] = useState([
    { id: 1, brand: 'Toyota', model: 'Camry', pricePerDay: 50, status: 'available' as const },
    { id: 2, brand: 'Honda', model: 'Accord', pricePerDay: 55, status: 'available' as const },
    { id: 3, brand: 'BMW', model: '3 Series', pricePerDay: 80, status: 'rented' as const },
    { id: 4, brand: 'Mercedes', model: 'C-Class', pricePerDay: 90, status: 'available' as const },
    { id: 5, brand: 'Tesla', model: 'Model 3', pricePerDay: 100, status: 'maintenance' as const },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@carrental.com', password: 'admin123', role: 'admin' as const, phone: '+1234567890' },
    { id: 2, name: 'John Doe', email: 'john@example.com', password: 'customer123', role: 'customer' as const, phone: '+1234567890' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', password: 'customer123', role: 'customer' as const, phone: '+1234567891' },
    { id: 4, name: 'Mike Johnson', email: 'mike@example.com', password: 'customer123', role: 'customer' as const, phone: '+1234567892' },
  ]);

  const [customers, setCustomers] = useState([
    { id: 2, name: 'John Doe', email: 'john@example.com', phone: '+1234567890' },
    { id: 3, name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891' },
    { id: 4, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1234567892' },
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerId: 2,
      customerName: 'John Doe',
      carId: 3,
      carInfo: 'BMW 3 Series',
      startDate: '2026-05-01',
      endDate: '2026-05-05',
      totalPrice: 320,
      status: 'confirmed' as const,
    },
    {
      id: 2,
      customerId: 3,
      customerName: 'Jane Smith',
      carId: 1,
      carInfo: 'Toyota Camry',
      startDate: '2026-05-10',
      endDate: '2026-05-15',
      totalPrice: 250,
      status: 'pending' as const,
    },
  ]);

  const [rentals, setRentals] = useState([
    {
      id: 1,
      bookingId: 1,
      customerName: 'John Doe',
      carInfo: 'BMW 3 Series',
      startDate: '2026-05-01',
      endDate: '2026-05-05',
      status: 'ongoing' as const,
    },
    {
      id: 2,
      bookingId: 2,
      customerName: 'Jane Smith',
      carInfo: 'Toyota Camry',
      startDate: '2026-05-10',
      endDate: '2026-05-15',
      status: 'booked' as const,
    },
  ]);

  const [payments, setPayments] = useState([
    {
      id: 1,
      bookingId: 1,
      customerName: 'John Doe',
      amount: 320,
      method: 'card' as const,
      status: 'completed' as const,
      date: '2026-05-01',
    },
    {
      id: 2,
      bookingId: 2,
      customerName: 'Jane Smith',
      amount: 250,
      method: 'cash' as const,
      status: 'pending' as const,
      date: '2026-05-10',
    },
  ]);

  const [feedback, setFeedback] = useState([
    {
      id: 1,
      customerId: 2,
      customerName: 'John Doe',
      bookingId: 1,
      rating: 5,
      comment: 'Great service! The car was in excellent condition.',
      date: '2026-05-06',
    },
  ]);

  // Auth handlers
  const handleLogin = (email: string, password: string) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
      setShowAuthModal(false);
      if (user.role === 'admin') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('browse');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  const handleSignup = (name: string, email: string, phone: string, password: string) => {
    const newUser = {
      id: users.length + 1,
      name,
      email,
      phone,
      password,
      role: 'customer' as const,
    };
    setUsers([...users, newUser]);

    const newCustomer = {
      id: newUser.id,
      name,
      email,
      phone,
    };
    setCustomers([...customers, newCustomer]);

    setCurrentUser({ id: newUser.id, name, email, role: 'customer' });
    setShowAuthModal(false);
    setActiveTab('browse');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('browse');
  };

  // Handlers
  const handleAddCar = (car: any) => {
    setCars([...cars, { ...car, id: cars.length + 1 }]);
  };

  const handleUpdateCar = (id: number, car: any) => {
    setCars(cars.map((c) => (c.id === id ? { ...car, id } : c)));
  };

  const handleDeleteCar = (id: number) => {
    setCars(cars.filter((c) => c.id !== id));
  };

  const handleAddCustomer = (customer: any) => {
    setCustomers([...customers, { ...customer, id: customers.length + 1 }]);
  };

  const handleUpdateCustomer = (id: number, customer: any) => {
    setCustomers(customers.map((c) => (c.id === id ? { ...customer, id } : c)));
  };

  const handleDeleteCustomer = (id: number) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  const handleBookCar = (carId: number) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setActiveTab('bookings');
  };

  const handleAddBooking = (booking: any) => {
    let customer;
    if (currentUser?.role === 'customer') {
      customer = customers.find((c) => c.id === currentUser.id);
      booking.customerId = currentUser.id;
    } else {
      customer = customers.find((c) => c.id === booking.customerId);
    }
    const car = cars.find((c) => c.id === booking.carId);
    const newBooking = {
      ...booking,
      id: bookings.length + 1,
      customerName: customer?.name || '',
      carInfo: `${car?.brand} ${car?.model}` || '',
    };
    setBookings([...bookings, newBooking]);

    // Create rental entry
    const newRental = {
      id: rentals.length + 1,
      bookingId: newBooking.id,
      customerName: newBooking.customerName,
      carInfo: newBooking.carInfo,
      startDate: newBooking.startDate,
      endDate: newBooking.endDate,
      status: 'booked' as const,
    };
    setRentals([...rentals, newRental]);

    // Create payment entry
    const newPayment = {
      id: payments.length + 1,
      bookingId: newBooking.id,
      customerName: newBooking.customerName,
      amount: newBooking.totalPrice,
      method: 'cash' as const,
      status: 'pending' as const,
      date: new Date().toISOString().split('T')[0],
    };
    setPayments([...payments, newPayment]);
  };

  const handleUpdateBookingStatus = (id: number, status: any) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleCancelBooking = (id: number) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b)));
  };

  const handleStartRental = (id: number) => {
    setRentals(rentals.map((r) => (r.id === id ? { ...r, status: 'ongoing' as const } : r)));
  };

  const handleEndRental = (id: number) => {
    setRentals(rentals.map((r) => (r.id === id ? { ...r, status: 'completed' as const } : r)));
  };

  const handleProcessPayment = (id: number, method: any) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, method, status: 'completed' as const } : p))
    );
  };

  const handleSubmitFeedback = (feedbackData: any) => {
    const booking = bookings.find((b) => b.id === feedbackData.bookingId);
    const newFeedback = {
      ...feedbackData,
      id: feedback.length + 1,
      customerName: booking?.customerName || '',
      date: new Date().toISOString().split('T')[0],
    };
    setFeedback([...feedback, newFeedback]);
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeRentals = rentals.filter((r) => r.status === 'ongoing').length;

  // Filter bookings for customer view
  const customerBookings = currentUser?.role === 'customer'
    ? bookings.filter(b => b.customerId === currentUser.id)
    : bookings;

  if (!currentUser) {
    return (
      <>
        <PublicView cars={cars} onLoginClick={() => setShowAuthModal(true)} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userRole={currentUser.role}
        userName={currentUser.name}
        onLogout={handleLogout}
      />

      <main>
        {currentUser.role === 'admin' && (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                totalCars={cars.length}
                totalBookings={bookings.length}
                totalRevenue={totalRevenue}
                activeRentals={activeRentals}
              />
            )}
            {activeTab === 'cars' && (
              <CarManagement
                cars={cars}
                onAddCar={handleAddCar}
                onUpdateCar={handleUpdateCar}
                onDeleteCar={handleDeleteCar}
              />
            )}
            {activeTab === 'customers' && (
              <CustomerManagement
                customers={customers}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
              />
            )}
            {activeTab === 'bookings' && (
              <BookingManagement
                bookings={bookings}
                customers={customers}
                cars={cars}
                onAddBooking={handleAddBooking}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onCancelBooking={handleCancelBooking}
              />
            )}
            {activeTab === 'rentals' && (
              <RentalProcessing
                rentals={rentals}
                onStartRental={handleStartRental}
                onEndRental={handleEndRental}
              />
            )}
            {activeTab === 'payments' && (
              <PaymentModule payments={payments} onProcessPayment={handleProcessPayment} />
            )}
            {activeTab === 'reports' && (
              <ReportsAndFeedback
                bookings={bookings}
                feedback={feedback}
                totalRevenue={totalRevenue}
                totalCars={cars.length}
              />
            )}
          </>
        )}

        {currentUser.role === 'customer' && (
          <>
            {activeTab === 'browse' && (
              <BrowseCars cars={cars} onBookCar={handleBookCar} />
            )}
            {activeTab === 'bookings' && (
              <BookingManagement
                bookings={customerBookings}
                customers={customers}
                cars={cars}
                onAddBooking={handleAddBooking}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onCancelBooking={handleCancelBooking}
              />
            )}
            {activeTab === 'reports' && (
              <CustomerFeedback
                bookings={customerBookings}
                feedback={feedback.filter(f => f.customerId === currentUser.id)}
                currentUserId={currentUser.id}
                onSubmitFeedback={handleSubmitFeedback}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}