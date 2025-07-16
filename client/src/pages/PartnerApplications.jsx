import React, { useState, useEffect } from 'react';
import { getAllPartnerApplications, updatePartnerApplicationStatus } from '../api/partners';
import { useAuth } from '../context/AuthContext';

const PartnerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getAllPartnerApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    setUpdating(true);
    try {
      await updatePartnerApplicationStatus(applicationId, status, reviewNotes);
      setApplications(applications.map(app => 
        app._id === applicationId 
          ? { ...app, status, reviewNotes, reviewedAt: new Date() }
          : app
      ));
      setShowModal(false);
      setSelectedApplication(null);
      setReviewNotes('');
    } catch (err) {
      setError('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
          <p className="mt-4 text-gray-600">Loading partner applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Partner Applications</h1>
          <p className="text-gray-600 mt-2">Review and manage partner applications</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600">No partner applications have been submitted yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {application.companyName}
                      </h3>
                      <p className="text-gray-600 mb-2">{application.eventType}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {application.contactPerson}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Contact Info</h4>
                      <p className="text-gray-600 text-sm">{application.email}</p>
                      <p className="text-gray-600 text-sm">{application.phone}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Margin</h4>
                      <p className="text-gray-600">{application.margin}%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Experience</h4>
                      <p className="text-gray-600">{application.experience} years</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Submitted</h4>
                      <p className="text-gray-600">{formatDate(application.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Event Details</h4>
                      <p className="text-gray-600 text-sm">{application.eventDetails}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Service Description</h4>
                      <p className="text-gray-600 text-sm">{application.serviceDescription}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
                      <p className="text-gray-600 text-sm">{application.pricing}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Portfolio</h4>
                      <p className="text-gray-600 text-sm">{application.portfolio}</p>
                    </div>
                    {application.additionalInfo && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Additional Info</h4>
                        <p className="text-gray-600 text-sm">{application.additionalInfo}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {application.reviewedAt && (
                        <span>Reviewed: {formatDate(application.reviewedAt)}</span>
                      )}
                    </div>
                    <div className="flex space-x-3">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
                          >
                            Review
                          </button>
                        </>
                      )}
                      {application.status !== 'pending' && application.reviewNotes && (
                        <div className="text-sm text-gray-600">
                          <strong>Notes:</strong> {application.reviewNotes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Review Application - {selectedApplication.companyName}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes about your decision..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate(selectedApplication._id, 'accepted')}
                disabled={updating}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
              >
                {updating ? 'Processing...' : 'Accept'}
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedApplication._id, 'declined')}
                disabled={updating}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-300"
              >
                {updating ? 'Processing...' : 'Decline'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApplication(null);
                  setReviewNotes('');
                }}
                disabled={updating}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerApplications; 
