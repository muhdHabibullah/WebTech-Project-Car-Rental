import { Star, TrendingUp, Users, MessageSquare, Calendar } from 'lucide-react';

interface Feedback {
  id: number;
  customerId: number;
  customerName: string;
  bookingId: number;
  rating: number;
  comment: string;
  date: string;
}

interface ReportsAndFeedbackProps {
  bookings: any[];
  feedback: Feedback[];
  totalRevenue: number;
  totalCars: number;
}

export function ReportsAndFeedback({ bookings, feedback, totalRevenue, totalCars }: ReportsAndFeedbackProps) {
  const completedBookings = bookings.filter((b) => b.status === 'confirmed');
  const averageRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: feedback.filter(f => f.rating === rating).length,
    percentage: feedback.length > 0
      ? ((feedback.filter(f => f.rating === rating).length / feedback.length) * 100).toFixed(0)
      : 0
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Customer Feedback</h1>
      <p className="text-gray-600 mb-6">Comprehensive overview of business performance and customer satisfaction</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{bookings.length}</span>
          </div>
          <p className="text-sm opacity-90">Total Bookings</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">RM{totalRevenue}</span>
          </div>
          <p className="text-sm opacity-90">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{feedback.length}</span>
          </div>
          <p className="text-sm opacity-90">Total Reviews</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{averageRating}</span>
          </div>
          <p className="text-sm opacity-90">Average Rating</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Rating Distribution</h2>
          <div className="space-y-4">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-24">
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    {count > 0 && <span className="text-xs font-semibold text-white">{count}</span>}
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Completed</span>
              <span className="font-bold text-blue-600">{completedBookings.length}</span>
            </div>
            <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Pending</span>
              <span className="font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Available Cars</span>
              <span className="font-bold text-green-600">{totalCars}</span>
            </div>
            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Feedback Rate</span>
              <span className="font-bold text-purple-600">
                {completedBookings.length > 0
                  ? Math.round((feedback.length / completedBookings.length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">All Customer Reviews</h2>
            <p className="text-sm text-gray-600">Recent feedback from customers</p>
          </div>
        </div>

        {feedback.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No customer feedback yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {feedback.map((item) => {
              const booking = bookings.find(b => b.id === item.bookingId);
              return (
                <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.customerName}</h3>
                      <p className="text-sm text-gray-600">{booking?.carInfo}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{item.comment}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Booking #{item.bookingId}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
