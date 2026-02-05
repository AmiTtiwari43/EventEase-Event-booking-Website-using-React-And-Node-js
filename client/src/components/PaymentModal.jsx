import { useState } from 'react';
import { createPaymentIntent, confirmPayment } from '../api/payments';

const PaymentModal = ({ isOpen, onClose, bookingData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Create payment intent
      const paymentIntent = await createPaymentIntent({
        ...bookingData,
        amount: bookingData.totalAmount * 100, // Convert to cents
        currency: 'inr'
      });

      // Simulate payment confirmation (in real app, integrate with Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await confirmPayment(paymentIntent.id);
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Checkout
            <span className="block text-sm font-medium text-gray-400 dark:text-gray-500 mt-1 italic">Complete your payment</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Booking Summary</h3>
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Service:</span>
              <span className="text-gray-900 dark:text-white font-bold">{bookingData.serviceTitle}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Date:</span>
              <span className="text-gray-900 dark:text-white font-bold">{new Date(bookingData.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Time:</span>
              <span className="text-gray-900 dark:text-white font-bold">{bookingData.time}</span>
            </div>
            <div className="flex justify-between items-center font-black text-xl border-t border-gray-100 dark:border-gray-700 pt-4 text-purple-600 dark:text-purple-400">
              <span className="text-gray-900 dark:text-white text-base">Total Amount:</span>
              <span>₹{bookingData.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 gap-3">
            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-purple-600 focus:ring-purple-500 dark:bg-gray-900 dark:border-gray-700"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Credit/Debit Card</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-purple-600 focus:ring-purple-500 dark:bg-gray-900 dark:border-gray-700"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">UPI</span>
            </label>
            <label className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={paymentMethod === 'netbanking'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3 text-purple-600 focus:ring-purple-500 dark:bg-gray-900 dark:border-gray-700"
              />
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Net Banking</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="alert alert-error mb-8 flex items-center gap-3 py-3 px-4 text-xs font-bold animate-shake">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay ₹${bookingData.totalAmount.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 