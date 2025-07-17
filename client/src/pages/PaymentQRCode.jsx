import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { markBookingPaid } from '../api/bookings';

const UPI_ID = 'tiwari.amit4356-1@okaxis';
const PAYEE_NAME = 'Amit Tiwari';

const PaymentQRCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const booking = location.state?.booking;

  if (!booking) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Invalid booking details.</div>;
  }

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${booking.amount}&tn=Booking%20Payment%20for%20${encodeURIComponent(booking.serviceTitle)}`;

  const handlePaymentDone = async () => {
    setLoading(true);
    setError('');
    try {
      await markBookingPaid(booking.id);
      setPaid(true);
    } catch (err) {
      setError(err.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Scan to Pay via UPI</h2>
        <div className="mb-4">
          <QRCodeSVG value={upiUrl} size={220} />
        </div>
        <div className="mb-4 text-center">
          <div className="font-semibold">Service: {booking.serviceTitle}</div>
          <div>Date: {new Date(booking.date).toLocaleDateString()}</div>
          <div>Time: {booking.time}</div>
          <div className="font-bold text-lg mt-2">Amount: ₹{booking.amount}</div>
        </div>
        {!paid ? (
          <>
            <button
              onClick={handlePaymentDone}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 mb-2"
            >
              {loading ? 'Processing...' : 'Payment Done'}
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </>
        ) : (
          <>
            <div className="text-green-600 font-bold mb-2">Payment marked as done!</div>
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-300"
            >
              Go to My Bookings
            </button>
          </>
        )}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Please scan the QR code with any UPI app and complete the payment.<br />
          (No backend verification, just click 'Payment Done' after paying.)
        </div>
      </div>
    </div>
  );
};

export default PaymentQRCode; 
