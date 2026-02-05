import { useState, useEffect } from 'react';
import { getUserBookings, cancelBooking, requestRefund, respondToReschedule } from '../api/bookings';
import { useNavigate, Link } from 'react-router-dom';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [refundRequested, setRefundRequested] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  };

  const handleRescheduleResponse = async (bookingId, action) => {
      // action = 'accept' or 'reject'
      if (!window.confirm(`Are you sure you want to ${action} this reschedule request?`)) return;

      try {
          await respondToReschedule(bookingId, action);
          fetchBookings(); // Refresh data
      } catch (err) {
          setError('Failed to update reschedule status');
      }
  };

  // Request refund and update UI
  const handleRequestRefund = async (bookingId) => {
    try {
      await requestRefund(bookingId);
      setRefundRequested((prev) => ({ ...prev, [bookingId]: true }));
      // Optionally, refresh bookings to get updated refund status
      fetchBookings();
    } catch (err) {
      setError('Failed to request refund');
    }
  };

  // Add pay now handler
  const handlePayNow = (booking) => {
    navigate('/payment-qr', {
      state: {
        booking: {
          id: booking._id,
          serviceTitle: booking.serviceId?.title,
          amount: booking.serviceId?.price,
          date: booking.date,
          time: booking.timeSlot
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
      case 'pending_admin_approval':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'pending_partner_approval':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
      case 'approved_pending_payment':
          return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300';
      case 'payment_verifying':
      case 'waiting_admin_confirmation':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300';
      case 'reschedule_requested':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b dark:border-gray-700 transition-colors duration-500">
        <div className="container mx-auto px-6 py-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your event bookings and reservations</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="text-gray-300 dark:text-gray-600 mb-8 flex justify-center">
              <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-full shadow-inner">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Your Event Journey Starts Here</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto text-lg">You haven&apos;t booked any events yet. Let&apos;s find the perfect service for your special occasion.</p>
            <Link
              to="/services"
              className="btn-primary"
            >
              Explore Services
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-white/10 hover:shadow-2xl transition-all duration-300 group animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="p-6 md:p-10">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {booking.serviceId?.title}
                        </h3>
                      </div>
                      <p className="text-purple-600 dark:text-purple-400 font-bold text-lg mb-4">{booking.serviceId?.category}</p>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-4 py-2 rounded-xl inline-flex border border-gray-100 dark:border-gray-800">
                        <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {booking.serviceId?.address}
                      </div>
                    </div>
                    <div className="mt-6 md:mt-0 md:ml-6 shrink-0">
                      <span className={`inline-flex items-center px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg ${getStatusColor(booking.status)} ring-4 ring-white/10 dark:ring-black/10`}>
                        <span className="w-2 h-2 rounded-full mr-3 animate-pulse bg-current"></span>
                        {booking.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Booking Date</h4>
                      <p className="text-gray-900 dark:text-white font-medium">{formatDate(booking.date)}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Duration</h4>
                      <p className="text-gray-900 dark:text-white font-medium">{booking.durationHours} hours</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Contact</h4>
                      <p className="text-gray-900 dark:text-white font-medium">{booking.name}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Phone</h4>
                      <p className="text-gray-900 dark:text-white font-medium">{booking.mobile}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-1">Time Slot</h4>
                      <p className="text-gray-900 dark:text-white font-medium">{booking.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t dark:border-gray-700 gap-4">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      ₹{booking.serviceId?.price?.toLocaleString()}
                    </div>
                    <div className="flex space-x-3">
                       {booking.status === 'reschedule_requested' && booking.reschedule?.status === 'requested' ? (
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 w-full items-start md:items-center bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-800/50">
                                <div className="flex-1 text-sm text-orange-800 dark:text-orange-300">
                                    <span className="font-bold">New Proposal:</span> {new Date(booking.reschedule.proposedDate).toLocaleDateString()} @ {booking.reschedule.proposedTimeSlot}
                                </div>
                                <div className="flex space-x-2 w-full md:w-auto">
                                  <button 
                                      onClick={() => handleRescheduleResponse(booking._id, 'accept')}
                                      className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-md"
                                  >
                                      Accept
                                  </button>
                                  <button 
                                      onClick={() => handleRescheduleResponse(booking._id, 'reject')}
                                      className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-md"
                                  >
                                      Reject
                                  </button>
                                </div>
                            </div>
                      ) : (
                        <>
                       {booking.status === 'pending' && (
                         <button
                           onClick={() => handleCancelBooking(booking._id)}
                           className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300 shadow-md transform hover:scale-105"
                         >
                           Cancel Booking
                         </button>
                       )}
                       {booking.status === 'cancelled' && booking.serviceId && booking.paymentStatus === 'paid' && (
                         <div className="flex items-center">
                           {(!booking.refund || (booking.refund.status !== 'requested' && booking.refund.status !== 'processed')) && !refundRequested[booking._id] ? (
                             <button
                               onClick={() => handleRequestRefund(booking._id)}
                               className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300 shadow-md transform hover:scale-105"
                             >
                               Request Refund
                             </button>
                           ) : booking.refund && booking.refund.status === 'requested' ? (
                             <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-4 py-2 rounded-lg font-bold">Refund Requested</span>
                           ) : booking.refund && booking.refund.status === 'processed' ? (
                             <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-bold">Refunded: ₹{booking.refund.amount}</span>
                           ) : null}
                         </div>
                       )}
                       {booking.status === 'approved_pending_payment' && booking.paymentStatus !== 'paid' && (
                         <button
                           onClick={() => handlePayNow(booking)}
                           className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold transition-all duration-300 shadow-md transform hover:scale-105"
                         >
                           Pay Now
                         </button>
                       )}
                       {(booking.status === 'payment_verifying' || booking.status === 'waiting_admin_confirmation') && (
                         <span className="text-purple-600 dark:text-purple-400 font-bold px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                           Verifying Payment...
                         </span>
                       )}
                       {booking.status === 'pending_admin_approval' && (
                          <span className="text-yellow-600 dark:text-yellow-400 font-bold px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                           Waiting Admin
                         </span>
                       )}
                       {booking.status === 'pending_partner_approval' && (
                          <span className="text-blue-600 dark:text-blue-400 font-bold px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                           Waiting Partner
                         </span>
                       )}
                       <Link
                         to={`/services/${booking.serviceId?._id}`}
                         className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded-xl font-bold transition-all duration-300 shadow-sm"
                       >
                         View Details
                       </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings; 
