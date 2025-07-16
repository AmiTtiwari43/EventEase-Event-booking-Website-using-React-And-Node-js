import React, { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../api/bookings';
import { getAllServices, deleteService, restoreService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import PartnerApplications from './PartnerApplications';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    if (user?.role !== 'admin') {
      setError('Access denied. Admin only.');
      return;
    }
    fetchData();
  }, [user]);

    const fetchData = async () => {
      try {
      const [bookingsData, servicesData] = await Promise.all([
        getAllBookings(),
        getAllServices()
      ]);
      setBookings(bookingsData);
        setServices(servicesData);
    } catch (err) {
      setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await deleteService(serviceId);
      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: false }
          : service
      ));
    } catch (err) {
      setError('Failed to delete service');
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
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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

  // Calculate analytics
  const totalRevenue = bookings.reduce((sum, booking) => {
    if (['confirmed', 'completed'].includes(booking.status)) {
      return sum + (booking.serviceId?.price || 0);
    }
    return sum;
  }, 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;
  const activeServices = services.filter(s => s.isActive).length;
  const deletedServices = services.filter(s => !s.isActive).length;
  const customServices = services.filter(s => s.isCustom).length;

  // Generate real monthly revenue data from bookings (by month and year)
  function getMonthYear(dateObj) {
    return `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  }

  const bookingMonths = bookings
    .filter(b => ['confirmed', 'completed'].includes(b.status) && b.date && b.serviceId?.price)
    .map(b => new Date(b.date))
    .sort((a, b) => a - b);

  let monthYearRange = [];
  if (bookingMonths.length > 0) {
    let start = bookingMonths[0];
    let end = bookingMonths[bookingMonths.length - 1];
    // Always show at least 6 months
    if (bookingMonths.length < 6) {
      end = new Date(start);
      end.setMonth(end.getMonth() + 5);
    }
    let current = new Date(start);
    while (current <= end) {
      monthYearRange.push(getMonthYear(current));
      current.setMonth(current.getMonth() + 1);
    }
    // Always show last 6 months
    if (monthYearRange.length > 6) {
      monthYearRange = monthYearRange.slice(-6);
    }
  } else {
    // No bookings, show current and next 5 months
    let current = new Date();
    for (let i = 0; i < 6; i++) {
      monthYearRange.push(getMonthYear(current));
      current.setMonth(current.getMonth() + 1);
    }
  }

  const monthlyRevenueMap = {};
  bookings.forEach(booking => {
    if (['confirmed', 'completed'].includes(booking.status) && booking.date && booking.serviceId?.price) {
      const dateObj = new Date(booking.date);
      const monthYear = getMonthYear(dateObj);
      if (!monthlyRevenueMap[monthYear]) {
        monthlyRevenueMap[monthYear] = 0;
      }
      monthlyRevenueMap[monthYear] += booking.serviceId.price;
    }
  });

  const monthlyData = monthYearRange.map(monthYear => ({
    month: monthYear,
    revenue: monthlyRevenueMap[monthYear] || 0
  }));

  const statusData = [
    { name: 'Confirmed', value: confirmedBookings, color: '#10B981' },
    { name: 'Pending', value: pendingBookings, color: '#F59E0B' },
    { name: 'Completed', value: completedBookings, color: '#3B82F6' },
    { name: 'Cancelled', value: cancelledBookings, color: '#EF4444' },
    { name: 'Rejected', value: rejectedBookings, color: '#DC2626' },
  ];

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>You don't have permission to access this page.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4 text-center animate-slide-up">
            Manage bookings, services, and analytics
          </h2>
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Custom Services</p>
                <p className="text-2xl font-bold text-gray-900">{customServices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                          </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          fontSize={12}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                      </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
                    <div className="text-sm text-gray-600">Confirmed Bookings</div>
                      </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingBookings}</div>
                    <div className="text-sm text-gray-600">Pending Bookings</div>
                      </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-red-600">{cancelledBookings}</div>
                    <div className="text-sm text-gray-600">Cancelled Bookings</div>
                      </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600">{completedBookings}</div>
                    <div className="text-sm text-gray-600">Completed Bookings</div>
                    </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="text-2xl font-bold text-red-600">{rejectedBookings}</div>
                    <div className="text-sm text-gray-600">Rejected Bookings</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {/* Show user name from userId, fallback to booking.name */}
                              {booking.userId?.name || booking.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.userId?.email || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              📱 {booking.mobile || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.serviceId?.title || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              💰 {booking.serviceId?.price ? `₹${booking.serviceId.price.toLocaleString()}` : 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              ⏱️ {booking.durationHours} hours
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              📅 {formatDate(booking.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              🕐 {booking.timeSlot || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              📍 {booking.serviceId?.address || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Booking Created: {formatDate(booking.createdAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-wrap gap-1">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking._id, 'rejected')}
                                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                                  >
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'completed' && (
                                <span className="text-green-600 text-xs">✓ Completed</span>
                              )}
                              {booking.status === 'cancelled' && (
                                <span className="text-red-600 text-xs">✗ Cancelled</span>
                              )}
                              {booking.status === 'rejected' && (
                                <span className="text-red-600 text-xs">✗ Rejected</span>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{service.title}</h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              service.isCustom 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {service.isCustom ? 'Custom' : 'Predefined'}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-blue-600">₹{service.price.toLocaleString()}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {service.category}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {service.duration}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!service.isActive ? (
                            <button
                              onClick={() => handleRestoreService(service._id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                            >
                              Restore
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeleteService(service._id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-300"
                            >
                              Delete
                            </button>
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
    </div>
  );
};

export default AdminDashboard; 
