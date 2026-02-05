import axios from './axios';

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get('/users/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put('/users/profile', profileData);
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Upload user avatar
export const uploadAvatar = async (formData) => {
  try {
    const response = await axios.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload avatar');
  }
};

// Change password
export const changePassword = async (passwordData) => {
  try {
    const response = await axios.put('/users/password', passwordData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};

// Delete user account
export const deleteAccount = async () => {
  try {
    const response = await axios.delete('/users/account');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete account');
  }
}; 
