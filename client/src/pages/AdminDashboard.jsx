import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus, getDashboardStats, refundBooking } from '../api/bookings';
import { getAllServices, deleteService, restoreService, updateService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import PartnerApplications from './PartnerApplications';
import EditServiceModal from '../components/EditServiceModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Notification from '../components/Notification';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({
    counts: { total: 0, pending: 0, confirmed: 0, cancelled: 0, completed: 0, rejected: 0 },
    totalRevenue: 0,
    monthlyData: [],
    popularServices: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, serviceId: null });
  const [refundConfirm, setRefundConfirm] = useState({ open: false, bookingId: null, amount: 0 });
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin only.');
      return;
    }
    fetchData();
  }, [user]);

  const handleUpdateService = async (id, updatedData) => {
    const updated = await updateService(id, updatedData);
    setServices(services.map(s => s._id === id ? updated : s));
  };

    const fetchData = async () => {
      try {
      const [bookingsData, servicesData, statsData] = await Promise.all([
        getAllBookings(),
        getAllServices(),
        getDashboardStats()
      ]);
      setBookings(bookingsData);
      setServices(servicesData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setNotification({ message: 'Booking status updated successfully!', type: 'success' });
      // Refresh data to ensure stats are up to date
      fetchData();
    } catch (err) {
      setNotification({ message: 'Failed to update booking status', type: 'error' });
    }
  };

  const handleDeleteService = (serviceId) => {
    setDeleteConfirm({ open: true, serviceId });
  };

  const confirmDeleteService = async () => {
    const serviceId = deleteConfirm.serviceId;
    try {
      await deleteService(serviceId);
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: false }
          : service
      ));
      setNotification({ message: 'Service deleted successfully!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to delete service', type: 'error' });
    } finally {
      setDeleteConfirm({ open: false, serviceId: null });
    }
  };

  const handleRefundBooking = (bookingId, amount) => {
    setRefundConfirm({ open: true, bookingId, amount });
  };

  const confirmRefundBooking = async () => {
    const { bookingId, amount } = refundConfirm;
    try {
      await refundBooking(bookingId, amount);
      setNotification({ message: 'Refund processed successfully!', type: 'success' });
      fetchData();
    } catch(e) { 
      setNotification({ message: 'Refund failed', type: 'error' });
    } finally {
      setRefundConfirm({ open: false, bookingId: null, amount: 0 });
    }
  };

  const handleRestoreService = async (serviceId) => {
    try {
      await restoreService(serviceId);
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: true }
          : service
      ));
    } catch (err) {
      setError('Failed to restore service');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending_admin_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_partner_approval':
        return 'bg-blue-100 text-blue-800';
      case 'approved_pending_payment':
        return 'bg-indigo-100 text-indigo-800';
      case 'waiting_admin_confirmation':
      case 'payment_verifying':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'reschedule_requested':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeServices = services.filter(s => s.isActive).length;
  const customServices = services.filter(s => s.isCustom).length;

  const statusData = [
    { name: 'Confirmed', value: stats.counts.confirmed, color: '#10B981' },
    { name: 'Pending', value: stats.counts.pending, color: '#F59E0B' },
    { name: 'Completed', value: stats.counts.completed, color: '#3B82F6' },
    { name: 'Cancelled', value: stats.counts.cancelled, color: '#EF4444' },
    { name: 'Rejected', value: stats.counts.rejected, color: '#DC2626' },
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>You don&apos;t have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-500">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.counts.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-white/20 dark:border-white/10">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Services</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{customServices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8 border border-white/20 dark:border-white/10 transition-colors duration-500">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'bookings', name: 'Bookings', icon: '📅' },
                { id: 'services', name: 'Services', icon: '🎯' },
                { id: 'partners', name: 'Partner Applications', icon: '🤝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={stats.monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                        <XAxis dataKey="month" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF', borderColor: theme === 'dark' ? '#374151' : '#E5E7EB', color: theme === 'dark' ? '#F3F4F6' : '#111827' }} 
                            itemStyle={{ color: theme === 'dark' ? '#F3F4F6' : '#111827' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#A78BFA" strokeWidth={3} dot={{ r: 4, fill: '#A78BFA' }} activeDot={{ r: 6 }} shadow="0 10px 15px -3px rgba(167, 139, 250, 0.4)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                          stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
                        />
                        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF', borderColor: theme === 'dark' ? '#374151' : '#E5E7EB', color: theme === 'dark' ? '#F3F4F6' : '#111827' }} 
                        />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]}>
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* New Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 5 Popular Services</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart layout="vertical" data={stats.popularServices}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                        <XAxis type="number" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <YAxis dataKey="name" type="category" width={150} stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF', borderColor: theme === 'dark' ? '#374151' : '#E5E7EB', color: theme === 'dark' ? '#F3F4F6' : '#111827' }} 
                        />
                        <Bar dataKey="value" fill="#8B5CF6" name="Bookings" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.categoryStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.categoryStats?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8B5CF6'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip 
                            formatter={(value) => `₹${value.toLocaleString()}`}
                            contentStyle={{ backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF', borderColor: theme === 'dark' ? '#374151' : '#E5E7EB', color: theme === 'dark' ? '#F3F4F6' : '#111827' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.counts.confirmed}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.counts.pending}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.counts.cancelled}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.counts.completed}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-lg p-6 text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.counts.rejected}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rejected</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.userId?.name || booking.name || 'N/A'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{booking.userId?.email || 'N/A'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">📱 {booking.mobile || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.serviceId?.title || 'N/A'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">💰 ₹{booking.serviceId?.price?.toLocaleString() || 'N/A'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">⏱️ {booking.durationHours} hours</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white">{formatDate(booking.date)}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{booking.timeSlot || 'N/A'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">📍 {booking.serviceId?.address || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)} dark:bg-opacity-20`}>
                              {booking.status.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {(booking.status === 'pending' || booking.status === 'pending_admin_approval') && (
                                <>
                                  <button onClick={() => handleStatusUpdate(booking._id, 'pending_partner_approval')} className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs transition-colors">Assign Partner</button>
                                  <button onClick={() => handleStatusUpdate(booking._id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors">Reject</button>
                                </>
                              )}
                              {(booking.status === 'waiting_admin_confirmation' || booking.status === 'payment_verifying') && (
                                <>
                                  <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors">Verify Payment</button>
                                  <button onClick={() => handleStatusUpdate(booking._id, 'rejected')} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors">Reject</button>
                                </>
                              )}
                              {(booking.status === 'confirmed' || booking.status === 'pending_partner_approval' || booking.status === 'approved_pending_payment' || booking.status === 'reschedule_requested') && (
                                <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs transition-colors">Cancel</button>
                              )}
                              {booking.refund && (booking.refund.status === 'requested' || booking.refund.status === 'pending') && (
                                   <button
                                     onClick={() => handleRefundBooking(booking._id, booking.refund.amount)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                  >
                                    Refund ₹{booking.refund.amount}
                                  </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden group hover:shadow-xl transition-all duration-300">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{service.title}</h4>
                            <span className={`inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider font-black rounded-md mt-2 ${
                              service.isCustom
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            }`}>
                              {service.isCustom ? 'Custom' : 'Predefined'}
                            </span>
                          </div>
                          <span className="text-xl font-black text-purple-600 dark:text-purple-400">₹{service.price.toLocaleString()}</span>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{service.description}</p>

                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                            <span className="mr-2 opacity-50">📂</span> {service.category}
                          </div>
                          <div className="flex items-center text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800">
                            <span className="mr-2 opacity-50">⏱️</span> {service.duration}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setEditingService(service)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-300">Edit</button>
                          {!service.isActive ? (
                            <button onClick={() => handleRestoreService(service._id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-green-500/20 transition-all duration-300">Restore</button>
                          ) : (
                            <button onClick={() => handleDeleteService(service._id)} className="flex-1 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 py-2.5 rounded-xl text-xs font-bold transition-all duration-300">Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'partners' && (
              <PartnerApplications />
            )}
          </div>
        </div>
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <EditServiceModal
          service={editingService}
          onClose={() => setEditingService(null)}
          onUpdate={handleUpdateService}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, serviceId: null })}
        onConfirm={confirmDeleteService}
        title="Delete Service?"
        message="Are you sure you want to delete this service? It will no longer be visible to customers."
        confirmText="Delete Service"
        type="danger"
      />

      {/* Refund Confirmation */}
      <ConfirmationModal
        isOpen={refundConfirm.open}
        onClose={() => setRefundConfirm({ open: false, bookingId: null, amount: 0 })}
        onConfirm={confirmRefundBooking}
        title="Process Refund?"
        message={`Are you sure you want to process a full refund of ₹${refundConfirm.amount}? This action cannot be undone.`}
        confirmText="Process Refund"
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
    </div>
  );
};

export default AdminDashboard;
