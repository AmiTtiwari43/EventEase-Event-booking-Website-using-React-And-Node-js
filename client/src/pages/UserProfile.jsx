import { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile, changePassword } from '../api/user';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setProfile({
        name: data.name || '',
        email: data.email || ''
      });
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await updateUserProfile(profile);
      login(updatedUser, user.token);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b dark:border-gray-700 transition-colors duration-500">
        <div className="container mx-auto px-6 py-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl mb-6 shadow-sm flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-6 py-4 rounded-xl mb-6 shadow-sm flex items-center">
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            {success}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-white/10">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 px-10 py-12 text-white relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 md:mb-0 md:mr-10 border border-white/30 shadow-2xl relative group">
                  <span className="text-5xl font-extrabold text-white drop-shadow-md">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                  <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex-1">
                  <h2 className="text-4xl font-extrabold mb-2 tracking-tight">{user?.name || 'User'}</h2>
                  <p className="text-purple-100/90 text-lg mb-4 font-medium">{user?.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/20">
                      {user?.role || 'customer'}
                    </span>
                    <span className="inline-flex items-center bg-emerald-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20 text-emerald-300">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
             {/* Decorative elements */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <nav className="flex px-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-sm font-bold transition-all duration-300 relative ${
                    activeTab === 'profile'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Profile Information
                  {activeTab === 'profile' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 animate-slide-in"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`px-6 py-4 text-sm font-bold transition-all duration-300 relative ${
                    activeTab === 'password'
                      ? 'text-purple-600 dark:text-purple-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Change Password
                  {activeTab === 'password' && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 animate-slide-in"></div>
                  )}
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'profile' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="form-label ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t dark:border-gray-700 gap-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                        Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="btn-primary"
                      >
                        {updating ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Updating...
                          </span>
                        ) : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'password' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="form-label ml-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label ml-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="form-input"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">Password must be at least 6 characters long</p>
                    </div>
                    <div>
                      <label className="form-label ml-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                      <button
                        type="submit"
                        disabled={changingPassword}
                        className="btn-primary bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 md:w-auto"
                      >
                        {changingPassword ? 'Changing Password...' : 'Change Password'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 
