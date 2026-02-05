import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { markBookingPaid } from '../api/bookings';
import Notification from '../components/Notification';

  const PaymentQR = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // The useAuth import and call were removed as the 'user' context was not being used in this component.

  const { booking } = location.state || {};
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (!booking) {
      navigate('/my-bookings');
    }
  }, [booking, navigate]);

  if (!booking) return null;

  // UPI Payment Link
  const upiId = 'tiwari.amit4356@okaxis';
  const payeeName = 'EventEase';
  const amount = booking.amount;
  const note = `Payment for Booking ${booking.id.slice(-6)}`;
  
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      await markBookingPaid(booking.id);
      // Navigate back to bookings after visual confirmation
      navigate('/my-bookings');
    } catch (error) {
      console.error("Payment confirmation failed", error);
      setNotification({ message: "Failed to confirm payment. Please try again.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center relative z-10 border border-white/20 dark:border-white/10 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Scan to Pay</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Complete your payment for <span className="text-purple-600 dark:text-purple-400 font-bold">{booking.serviceTitle}</span></p>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl mb-8 inline-block shadow-inner ring-1 ring-gray-100 dark:ring-gray-800 group transition-transform hover:scale-105 duration-300">
          <QRCodeCanvas 
            value={upiUrl} 
            size={220} 
            level={"H"}
            includeMargin={true}
            className="rounded-xl dark:invert dark:opacity-90 dark:brightness-125"
          />
        </div>
        <div className="text-left bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl mb-8 border border-purple-100 dark:border-purple-800/50 shadow-sm">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Payable Amount</p>
          <p className="text-3xl font-black text-purple-700 dark:text-purple-400 mb-4 tracking-tight">₹{amount.toLocaleString()}</p>
          
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">UPI ID</p>
          <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-3 rounded-xl border border-purple-200 dark:border-gray-700 shadow-inner group">
            <code className="text-sm font-mono text-gray-800 dark:text-gray-200">{upiId}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(upiId)}
              className="text-xs text-purple-600 dark:text-purple-400 font-bold hover:underline px-2 py-1 bg-purple-100/50 dark:bg-purple-900/40 rounded-lg group-hover:scale-110 transition-transform"
            >
              COPY
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => setShowConfirm(true)}
            className="btn-primary"
          >
            I Have Paid
          </button>
          <button 
            onClick={() => navigate('/my-bookings')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Please keep a screenshot of your payment for verification.
        </p>
      </div>

      {/* Styled Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl max-w-sm w-full transform transition-all animate-scale-up text-center border border-white/20 dark:border-white/10 ring-1 ring-black/5">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-glow">
              <svg className="w-10 h-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Payment Recorded</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Awesome! Our team will verify your payment shortly. You can track the status in your bookings.
            </p>
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : 'Back to My Bookings'}
            </button>
          </div>
        </div>
      )}

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default PaymentQR;
