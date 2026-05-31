import { useState } from 'react';
import { Star, MessageSquare, CheckCircle } from 'lucide-react';

interface Feedback {
  id: number;
  customerId: number;
  customerName: string;
  bookingId: number;
  rating: number;
  comment: string;
  date: string;
}

interface CustomerFeedbackProps {
  bookings: any[];
  feedback: Feedback[];
  currentUserId: number;
  onSubmitFeedback: (feedback: Omit<Feedback, 'id' | 'customerName' | 'date'>) => void;
}

export function CustomerFeedback({ bookings, feedback, currentUserId, onSubmitFeedback }: CustomerFeedbackProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: currentUserId,
    bookingId: 0,
    rating: 5,
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback(formData);
    setFormData({ customerId: currentUserId, bookingId: 0, rating: 5, comment: '' });
    setShowForm(false);
  };

  const completedBookings = bookings.filter((b) => b.status === 'confirmed');
  const bookingsWithFeedback = new Set(feedback.map(f => f.bookingId));
  const bookingsNeedingFeedback = completedBookings.filter(b => !bookingsWithFeedback.has(b.id));

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
        <p className="text-gray-600 mb-8">Help us improve by sharing your feedback on your rentals</p>

        {bookingsNeedingFeedback.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Pending Feedback</h3>
                <p className="text-sm text-blue-800 mb-4">
                  You have {bookingsNeedingFeedback.length} completed booking(s) waiting for your feedback
                </p>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Leave Feedback
                </button>
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Booking</label>
                <select
                  value={formData.bookingId}
                  onChange={(e) => setFormData({ ...formData, bookingId: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value={0}>Choose a booking to review</option>
                  {bookingsNeedingFeedback.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.carInfo} - {booking.startDate} to {booking.endDate}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {formData.rating === 5 && 'Excellent!'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 1 && 'Poor'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Comments</label>
                <textarea
                  placeholder="Tell us about your experience with the car and our service..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px]"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Submit Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Your Feedback History</h2>
          {feedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't submitted any feedback yet</p>
              <p className="text-sm text-gray-400 mt-2">Complete a booking to share your experience</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => {
                const booking = bookings.find(b => b.id === item.bookingId);
                return (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking?.carInfo}</h3>
                        <p className="text-sm text-gray-600">
                          {booking?.startDate} to {booking?.endDate}
                        </p>
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
                    <p className="text-gray-700 mb-2">{item.comment}</p>
                    <p className="text-xs text-gray-500">Submitted on {item.date}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
