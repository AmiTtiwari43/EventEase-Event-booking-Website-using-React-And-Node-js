import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import { deleteService, updateService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import EditServiceModal from '../components/EditServiceModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';

const PartnerDashboard = () => {
  const { user } = useAuth();
  const [myServices, setMyServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, services, bookings
  const [actionLoading, setActionLoading] = useState({}); // Track loading state for specific items
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, bookingId: null, date: '', time: '' });
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, serviceId: null });
  const [editingService, setEditingService] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [servicesRes, bookingsRes] = await Promise.allSettled([
        axios.get('/services?limit=100'),
        axios.get('/bookings/partner')
      ]);

      // Handle Services Response
      if (servicesRes.status === 'fulfilled') {
        const allServices = Array.isArray(servicesRes.value.data) ? servicesRes.value.data : [];
        const userServices = allServices.filter(s => 
          (s.createdBy?._id === user._id) || (s.createdBy === user._id)
        );
        setMyServices(userServices);
      } else {
        console.error('Failed to fetch services:', servicesRes.reason);
        // Don't block the whole dashboard, just log
      }

      // Handle Bookings Response
      if (bookingsRes.status === 'fulfilled') {
        setBookings(Array.isArray(bookingsRes.value.data) ? bookingsRes.value.data : []);
      } else {
         console.error('Failed to fetch bookings:', bookingsRes.reason);
         setError('Failed to load bookings. Please refresh.');
      }

    } catch (err) {
      console.error('Error fetching partner data:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateService = async (id, updatedData) => {
    const updated = await updateService(id, updatedData);
    setMyServices(prev => prev.map(s => s._id === id ? updated : s));
  };

  const handleBookingAction = async (bookingId, status) => {
    if (actionLoading[bookingId]) return; // Prevent double clicks
    
    setActionLoading(prev => ({ ...prev, [bookingId]: true }));
    try {
      await axios.put(`/bookings/${bookingId}/status`, { status });
      
      // Optimistic update
      setBookings(prev => prev.map(b => 
        b._id === bookingId ? { ...b, status: status === 'rejected' ? 'rejected' : 'confirmed' } : b
      ));

      // Fetch fresh data in background to ensure sync
      const res = await axios.get('/bookings/partner');
      setBookings(res.data);
     } catch (error) {
      console.error('Error updating booking:', error);
      setNotification({ message: 'Failed to update booking status. Please try again.', type: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleDeleteService = (serviceId) => {
    setDeleteConfirm({ open: true, serviceId });
  };

  const confirmDeleteService = async () => {
    const serviceId = deleteConfirm.serviceId;
    setActionLoading(prev => ({ ...prev, [serviceId]: true }));
    try {
      await deleteService(serviceId);
      setMyServices(prev => prev.filter(s => s._id !== serviceId));
      setNotification({ message: 'Service deleted successfully!', type: 'success' });
    } catch (error) {
      console.error('Error deleting service:', error);
      setNotification({ message: 'Failed to delete service. It may be linked to existing bookings.', type: 'error' });
    } finally {
      setActionLoading(prev => ({ ...prev, [serviceId]: false }));
      setDeleteConfirm({ open: false, serviceId: null });
    }
  };



   const handleSubmitReschedule = async () => {
    if (!rescheduleModal.date || !rescheduleModal.time) return setNotification({ message: 'Please select date and time', type: 'warning' });
    
    setActionLoading(prev => ({ ...prev, [rescheduleModal.bookingId]: true }));
    try {
        await axios.put(`/bookings/${rescheduleModal.bookingId}/reschedule`, {
            proposedDate: rescheduleModal.date,
            proposedTimeSlot: rescheduleModal.time,
            reason: 'Partner requested reschedule'
        });
        setNotification({ message: 'Reschedule request sent to user!', type: 'success' });
        setRescheduleModal({ open: false, bookingId: null, date: '', time: '' });
        fetchData(); // Refresh to see status change
    } catch (error) {
        console.error('Error rescheduling:', error);
        setNotification({ message: 'Failed to send reschedule request', type: 'error' });
    } finally {
        setActionLoading(prev => ({ ...prev, [rescheduleModal.bookingId]: false }));
    }
  };

  const handlePartnerCancel = async () => {
     setActionLoading(prev => ({ ...prev, [cancelModal.bookingId]: true }));
     try {
         await axios.put(`/bookings/${cancelModal.bookingId}/partner-cancel`);
         setNotification({ message: 'Booking cancelled. Refund process initiated.', type: 'success' });
         setCancelModal({ open: false, bookingId: null });
         fetchData();
     } catch (error) {
         console.error('Error cancelling:', error);
         setNotification({ message: 'Failed to cancel booking', type: 'error' });
     } finally {
         setActionLoading(prev => ({ ...prev, [cancelModal.bookingId]: false }));
     }
  };

  if (loading) return <div className="p-8 text-center min-h-screen pt-32 bg-gray-50 dark:bg-gray-900"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div><p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p></div>;

  if (error) return (
    <div className="p-8 text-center">
      <div className="text-red-500 text-xl font-semibold mb-4">{error}</div>
      <button onClick={fetchData} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Retry</button>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-black mb-8 text-gray-900 dark:text-white tracking-tight">Partner Dashboard</h1>
      
      <div className="flex space-x-8 mb-10 border-b dark:border-gray-700 overflow-x-auto no-scrollbar">
        <button 
          className={`pb-4 px-2 whitespace-nowrap transition-all duration-300 relative ${activeTab === 'overview' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
          {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 dark:bg-purple-400 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.4)]"></div>}
        </button>
        <button 
          className={`pb-4 px-2 whitespace-nowrap transition-all duration-300 relative ${activeTab === 'services' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('services')}
        >
          My Services ({myServices.length})
          {activeTab === 'services' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 dark:bg-purple-400 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.4)]"></div>}
        </button>
        <button 
          className={`pb-4 px-2 whitespace-nowrap transition-all duration-300 relative ${activeTab === 'bookings' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings ({bookings.length})
          {activeTab === 'bookings' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 dark:bg-purple-400 rounded-t-full shadow-[0_-2px_10px_rgba(168,85,247,0.4)]"></div>}
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in shadow-sm">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-purple-500/5 border border-white/20 dark:border-white/10 group hover:scale-[1.02] transition-transform duration-300">
            <h3 className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">Total Services</h3>
            <p className="text-4xl font-black text-gray-900 dark:text-white mt-2 group-hover:text-purple-600 transition-colors">{myServices.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-yellow-500/5 border border-white/20 dark:border-white/10 group hover:scale-[1.02] transition-transform duration-300">
             <h3 className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">Pending Approvals</h3>
             <p className="text-4xl font-black text-gray-900 dark:text-white mt-2 group-hover:text-yellow-500 transition-colors">{bookings.filter(b => b.status === 'admin_approved').length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl shadow-green-500/5 border border-white/20 dark:border-white/10 group hover:scale-[1.02] transition-transform duration-300">
             <h3 className="text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black">Confirmed Bookings</h3>
             <p className="text-4xl font-black text-gray-900 dark:text-white mt-2 group-hover:text-green-500 transition-colors">{bookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">My Services</h2>
              <Link to="/services/new" className="btn-primary flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                New Service
              </Link>
            </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {myServices.map(service => (
               <div key={service._id} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-lg transition duration-300">
                 <img 
                   src={service.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'} 
                   alt={service.title} 
                   className="w-full h-48 object-cover rounded-lg mb-4"
                 />
                 <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white line-clamp-1">{service.title}</h3>
                 <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs px-2 py-1 rounded-full mb-2">
                   {service.category}
                 </span>
                 <p className="font-bold text-xl text-purple-600 dark:text-purple-400">₹{service.price?.toLocaleString()}</p>
                  <div className="mt-4 flex space-x-2 pt-4 border-t dark:border-gray-700 font-medium">
                    <button 
                      onClick={() => setEditingService(service)} // New Edit button
                      className="text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1 rounded transition font-medium"
                    >
                      Edit
                    </button>
                   <button 
                     onClick={() => handleDeleteService(service._id)}
                     disabled={actionLoading[service._id]}
                     className={`text-red-600 text-sm hover:bg-red-50 px-3 py-1 rounded transition ${actionLoading[service._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                   >
                     {actionLoading[service._id] ? 'Deleting...' : 'Delete'}
                   </button>
                 </div>
               </div>
             ))}
              {myServices.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">You haven&apos;t posted any services yet.</p>
                  <Link to="/services/new" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">Create your first service now &rarr;</Link>
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="animate-fade-in">
           <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Bookings Management</h2>
           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                 <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date/Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                 </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map(booking => (
                      <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.serviceId?.title || <span className="text-red-400 dark:text-red-300 italic">Deleted Service</span>}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">ID: {booking._id.slice(-6)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{booking.mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{new Date(booking.date).toLocaleDateString()}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{booking.timeSlot}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full dark:bg-opacity-20
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:text-green-400' : 
                              booking.status === 'pending_partner_approval' ? 'bg-blue-100 text-blue-800 dark:text-blue-400' :
                              booking.status === 'approved_pending_payment' ? 'bg-indigo-100 text-indigo-800 dark:text-indigo-400' :
                              booking.status === 'pending_admin_approval' ? 'bg-yellow-100 text-yellow-800 dark:text-yellow-400' :
                              booking.status === 'payment_verifying' ? 'bg-purple-100 text-purple-800 dark:text-purple-400' :
                              booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:text-red-400' :
                              'bg-gray-100 text-gray-800 dark:text-gray-400'}`}>
                           {booking.status === 'pending_partner_approval' ? 'Action Required' : booking.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                         </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                         {booking.status === 'pending_partner_approval' ? (
                           <div className="flex space-x-2">
                             <button 
                               onClick={() => handleBookingAction(booking._id, 'approved_pending_payment')}
                               disabled={actionLoading[booking._id]}
                               className={`bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition ${actionLoading[booking._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                               {actionLoading[booking._id] ? '...' : 'Approve'}
                             </button>
                             <button 
                               onClick={() => handleBookingAction(booking._id, 'rejected')}
                               disabled={actionLoading[booking._id]}
                               className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ${actionLoading[booking._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                               {actionLoading[booking._id] ? '...' : 'Reject'}
                             </button>
                           </div>
                         ) : booking.status === 'confirmed' ? (
                            <div className="flex space-x-2">
                             <button 
                               onClick={() => handleBookingAction(booking._id, 'completed')}
                               disabled={actionLoading[booking._id]}
                               className={`bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition ${actionLoading[booking._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                               {actionLoading[booking._id] ? '...' : 'Mark Completed'}
                             </button>
                           </div>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xs text-center block">
                              {booking.status === 'admin_approved' ? 'Legacy Status' : 
                               booking.status === 'pending_admin_approval' ? 'Waiting Admin' :
                               booking.status === 'approved_pending_payment' ? 'Waiting Payment' :
                               booking.status === 'payment_verifying' ? 'Verifying Payment' :
                               booking.status === 'completed' ? 'Completed' : 'No actions'}
                            </span>
                          )}
                       </td>
                     </tr>
                   ))}
                    {bookings.length === 0 && (
                       <tr>
                         <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                           <p className="text-lg">No bookings found yet.</p>
                         </td>
                       </tr>
                    )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

            {/* Reschedule Modal */}
           {rescheduleModal.open && (
               <div className="modal-overlay">
                   <div className="modal-content animate-fade-in">
                       <h3 className="text-3xl font-black mb-6 tracking-tight">Reschedule</h3>
                       <div className="space-y-6">
                           <div>
                               <label className="form-label font-bold text-xs uppercase tracking-widest">New Date</label>
                               <input 
                                   type="date" 
                                   value={rescheduleModal.date}
                                   onChange={(e) => setRescheduleModal({...rescheduleModal, date: e.target.value})}
                                   className="form-input"
                               />
                           </div>
                           <div>
                               <label className="form-label font-bold text-xs uppercase tracking-widest">New Time Slot</label>
                               <input 
                                   type="text" 
                                   value={rescheduleModal.time}
                                   placeholder="e.g. 10:00 AM - 12:00 PM"
                                   onChange={(e) => setRescheduleModal({...rescheduleModal, time: e.target.value})}
                                   className="form-input"
                               />
                           </div>
                           <div className="flex gap-4 pt-4">
                               <button 
                                   onClick={() => setRescheduleModal({ ...rescheduleModal, open: false })}
                                   className="flex-1 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium"
                               >
                                   Cancel
                               </button>
                               <button 
                                   onClick={handleSubmitReschedule}
                                   className="flex-1 btn-primary py-3 rounded-2xl"
                               >
                                   Send Request
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

            {/* Cancel Confirmation Modal */}
           {cancelModal.open && (
               <ConfirmationModal
                isOpen={cancelModal.open}
                onClose={() => setCancelModal({ open: false, bookingId: null })}
                onConfirm={handlePartnerCancel}
                title="Cancel Booking?"
                message="Are you sure you want to cancel this event? If the user has paid, a refund request will be automatically generated."
                confirmText="Yes, Cancel Event"
                type="danger"
               />
           )}

      {/* Delete Service Confirmation */}
      <ConfirmationModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, serviceId: null })}
        onConfirm={confirmDeleteService}
        title="Delete Service?"
        message="Are you sure you want to delete this service? This action cannot be undone if there are no active bookings."
        confirmText="Delete Service"
        type="danger"
      />

      {/* Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onUpdate={handleUpdateService}
        />
      )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
