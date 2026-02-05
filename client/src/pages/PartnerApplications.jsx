import { useState, useEffect } from 'react';
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

  const handleStatusUpdate = async (applicationId, status, margin) => {
    setUpdating(true);
    try {
      await updatePartnerApplicationStatus(applicationId, status, reviewNotes, margin);
      setApplications(applications.map(app => 
        app._id === applicationId 
          ? { ...app, status, reviewNotes, margin: margin !== undefined ? margin : app.margin, reviewedAt: new Date() }
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
          <p className="mt-4 text-gray-600">Loading partner applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-500">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Partner Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Review and manage onboarding requests</p>
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
              <div key={application._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-white/10 group animate-fade-in hover:shadow-2xl transition-all duration-300">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight group-hover:text-purple-600 transition-colors">
                        {application.companyName}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">
                          {application.eventType}
                        </span>
                        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
                          <svg className="w-4 h-4 mr-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {application.contactPerson}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      <span className={`inline-block px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${getStatusColor(application.status)} dark:bg-opacity-20`}>
                        {application.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contact Info</h4>
                      <p className="text-gray-900 dark:text-white text-sm font-medium">{application.email}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{application.phone}</p>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Platform Margin</h4>
                      <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{application.margin}%</p>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Industry Experience</h4>
                      <p className="text-2xl font-black text-gray-900 dark:text-white">{application.experience} <span className="text-sm font-medium text-gray-500">Years</span></p>
                    </div>
                    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date Submitted</h4>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6 mb-8 bg-gray-50/30 dark:bg-gray-900/30 p-6 rounded-2xl border border-gray-100/50 dark:border-gray-800/50">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div>
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Event Scope</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{application.eventDetails}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Service Description</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{application.serviceDescription}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Pricing Structure</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{application.pricing}</p>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Portfolio/Links</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{application.portfolio}</p>
                      </div>
                    </div>
                    {application.additionalInfo && (
                      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Additional Comments</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{application.additionalInfo}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {application.reviewedAt && (
                        <span>Decision finalized: {formatDate(application.reviewedAt)}</span>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      {application.status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowModal(true);
                          }}
                          className="btn-primary"
                        >
                          Launch Review
                        </button>
                      )}
                      {application.status !== 'pending' && application.reviewNotes && (
                        <div className="text-sm bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-xl text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50">
                          <strong className="font-black uppercase text-[10px] mr-2 opacity-50">Decision Notes:</strong> {application.reviewNotes}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 pr-8 tracking-tight">
              Finalize Decision
              <span className="block text-sm font-medium text-gray-500 mt-1">{selectedApplication.companyName}</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="form-label mb-2">Platform Percentage Margin</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={selectedApplication.margin}
                    onChange={(e) => setSelectedApplication({
                      ...selectedApplication, 
                      margin: parseInt(e.target.value) || 0
                    })}
                    className="form-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="form-label mb-2">Decision Rationale (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows="3"
                  className="form-input resize-none"
                  placeholder="Explain your decision..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => handleStatusUpdate(selectedApplication._id, 'accepted', selectedApplication.margin)}
                disabled={updating}
                className="btn-primary"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedApplication._id, 'declined')}
                disabled={updating}
                className="btn-secondary text-red-600! dark:text-red-400!"
              >
                Decline
              </button>
            </div>
            
            <button
                onClick={() => handleStatusUpdate(selectedApplication._id, 'negotiating', selectedApplication.margin)}
                disabled={updating}
                 className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-yellow-500/20 active:scale-95 text-sm"
              >
                Request Negotiation
            </button>

            <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApplication(null);
                  setReviewNotes('');
                }}
                disabled={updating}
                className="w-full mt-4 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Back to List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerApplications;
