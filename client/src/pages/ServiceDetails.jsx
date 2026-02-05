import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById } from '../api/services';
import { createBooking, getBookedSlots } from '../api/bookings';
import { getServiceReviews, addReview } from '../api/reviews';
import ReviewItem from '../components/ReviewItem';
import { useAuth } from '../context/AuthContext';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const TIME_SLOTS = [
    '08:00-10:00',
    '10:00-12:00',
    '12:00-14:00',
    '14:00-16:00',
    '16:00-18:00',
    '18:00-20:00',
    '20:00-22:00'
  ];
  const [bookingData, setBookingData] = useState({
    name: '',
    mobile: '',
    date: '',
    durationHours: 2,
    timeSlot: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();

  // Service images for carousel
  const serviceImages = [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  ];

  const fetchReviews = useCallback(async () => {
    try {
      const data = await getServiceReviews(id);
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(id);
        setService(data);
        await fetchReviews();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
    // Start interval for carousel
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        serviceImages.length ? (prev + 1) % serviceImages.length : 0
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [id, serviceImages.length, fetchReviews]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (bookingData.date && id) {
      const fetchSlots = async () => {
        try {
          const slots = await getBookedSlots(id, bookingData.date);
          setBookedSlots(slots);
        } catch (err) {
          console.error("Error fetching booked slots", err);
        }
      };
      fetchSlots();
    } else {
        setBookedSlots([]);
    }
  }, [bookingData.date, id]);

  const handleBooking = async () => {
    setError('');
    
    // Strict Validation
    if (!bookingData.name.trim() || bookingData.name.length < 3) {
        setError('Name must be at least 3 characters long');
        return;
    }

    // Validate Indian Mobile Number (10 digits)
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(bookingData.mobile)) {
        setError('Please enter a valid 10-digit mobile number');
        return;
    }

    if (!bookingData.date) {
        setError('Please select a date');
        return;
    }

    if (!bookingData.timeSlot) {
        setError('Please select a time slot');
        return;
    }

    setBookingLoading(true);
    
    try {
      await createBooking({
        serviceId: id,
        ...bookingData
      });

      // Redirect to QR code payment page with booking info
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, newReview);
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews(); // Refresh reviews
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading service details...</p>
      </div>
    </div>
  );

  if (error && !service) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-red-500">
        <p className="text-xl">{error}</p>
      </div>
    </div>
  );

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Hero Section with Image Carousel */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {serviceImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`${service.title} ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-[2px]"></div>
          </div>
        ))}
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg text-gradient leading-tight">{service.title}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-medium text-gray-100 dark:text-gray-200">{service.description.substring(0, 150)}...</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.round(service.averageRating || 0) ? 'text-yellow-400' : 'text-white/30'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-bold">{service.averageRating?.toFixed(1) || '0.0'} <span className="text-sm font-normal opacity-80">({service.reviewCount || 0} reviews)</span></span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{service.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {serviceImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-white/10 transition-colors duration-500">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-8 bg-purple-600 rounded-full mr-4"></span>
                About This Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{service.category}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Price</h3>
                  {service.discount > 0 ? (
                    <div>
                        <span className="text-gray-500 line-through mr-3">₹{service.price.toLocaleString()}</span>
                        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            ₹{Math.round(service.price * (1 - service.discount / 100)).toLocaleString()}
                        </span>
                        <span className="ml-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-bold">
                            {service.discount}% OFF
                        </span>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹{service.price.toLocaleString()}</p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Location</h3>
                  <p className="text-xl font-bold text-gray-900 dark:text-white italic">{service.address}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Availability</h3>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">7 Days/Week</p>
                </div>
                 <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50 md:col-span-2">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-3">Organized By</h3>
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{service.companyName || 'EventEase Partner'}</p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium italic">📞 {service.companyContact || 'Not Available'}</p>
                    </div>
                     <a href={`tel:${service.companyContact}`} className="bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-6 py-2 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform">Call Now</a>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line">{service.description}</p>
            </div>

            {/* Ratings Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-white/10 transition-colors duration-500" id="reviews-section">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                   <span className="w-1.5 h-6 bg-yellow-400 rounded-full mr-3"></span>
                   Ratings & Reviews
                </h2>
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    {/* Overall Score */}
                    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 min-w-[150px]">
                         <div className="text-7xl font-black text-gray-900 dark:text-white mb-2">
                             {service.averageRating?.toFixed(1) || '0.0'}
                         </div>
                         <div className="flex text-yellow-400 mb-2 scale-125">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-5 h-5 ${i < Math.round(service.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                         </div>
                         <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">{service.reviewCount || 0} Ratings</p>
                    </div>

                    {/* Progress Bars */}
                    <div className="flex-1 w-full space-y-3">
                        {[5, 4, 3, 2, 1].map(star => {
                            const count = reviews.filter(r => Math.round(r.rating) === star).length;
                            const percentage = reviews.length ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-4">
                                    <div className="w-8 text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                        {star} <span className="text-yellow-500 text-xs">★</span>
                                    </div>
                                    <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${star >= 4 ? 'bg-green-500' : star === 3 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-10 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-white/20 dark:border-white/10 transition-colors duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                   <span className="w-1.5 h-6 bg-purple-600 rounded-full mr-3"></span>
                   Customer Feedback
                </h2>

                {user && user.role === 'customer' && (
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-10 p-8 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-700 animate-fade-in shadow-inner">
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">How was your experience?</label>
                      <div className="flex space-x-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="text-4xl hover:scale-125 transition-all duration-200"
                          >
                            {star <= newReview.rating ? (
                              <span className="text-yellow-400">★</span>
                            ) : (
                              <span className="text-gray-300 dark:text-gray-700">★</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Your detailed feedback</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full px-5 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent transition-all dark:text-white"
                        rows="5"
                        placeholder="What did you like or dislike? Help others by sharing your thoughts..."
                        required
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 md:flex-none bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-purple-500/25"
                      >
                        Publish Review
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8 text-lg">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map(review => (
                    <ReviewItem key={review._id} review={review} onUpdate={fetchReviews} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sticky top-24 border border-white/20 dark:border-white/10 transition-colors duration-500">
              <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
                Book Now
              </h3>
              {user && (
                <>
                  {error && (
                    <div className="alert alert-error mb-8 flex items-center gap-3">
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                      <span className="font-bold">{error}</span>
                    </div>
                  )}
                 <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Your Full Name</label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        className="form-input"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                      <input
                        type="tel"
                        value={bookingData.mobile}
                        onChange={(e) => {
                            // Only allow numbers
                            const re = /^[0-9\b]+$/;
                            if (e.target.value === '' || re.test(e.target.value)) {
                                setBookingData({ ...bookingData, mobile: e.target.value })
                            }
                        }}
                        maxLength="10"
                        className="form-input"
                        placeholder="10-digit mobile number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Pick a Time Slot</label>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {TIME_SLOTS.map(slot => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = bookingData.timeSlot === slot;
                          
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => !isBooked && setBookingData({ ...bookingData, timeSlot: slot })}
                              disabled={isBooked}
                              className={`
                                py-3 px-2 rounded-xl text-xs font-bold transition-all duration-300 border
                                ${isBooked 
                                  ? 'bg-red-50 dark:bg-red-900/10 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/30 cursor-not-allowed opacity-60' 
                                  : isSelected
                                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/30 transform scale-105'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                }
                              `}
                            >
                              <div className="flex flex-col items-center">
                                <span>{slot}</span>
                                <span className={`text-[10px] font-bold mt-1 uppercase ${isBooked ? 'text-red-400' : isSelected ? 'text-white' : 'text-emerald-500'}`}>
                                  {isBooked ? 'Booked' : 'Available'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                   <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <div className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                        <span className="text-lg">Service Price:</span>
                        <div className="text-right">
                            {service.discount > 0 && (
                                <span className="text-sm text-gray-500 line-through block">₹{service.price.toLocaleString()}</span>
                            )}
                            <span className="text-lg font-semibold">
                                ₹{Math.round(service.price * (1 - (service.discount || 0) / 100)).toLocaleString()}
                            </span>
                        </div>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-lg">Duration:</span>
                        <span className="text-lg font-semibold">2 hours</span>
                      </div>
                    </div>
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading || !bookingData.date || !bookingData.name || !bookingData.mobile || !bookingData.timeSlot}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Book Now'
                      )}
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Please login to book this service</p>
                  <button
                    onClick={() => navigate('/login', { state: { from: `/services/${id}` } })}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
                  >
                    Login to Book
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails; 
