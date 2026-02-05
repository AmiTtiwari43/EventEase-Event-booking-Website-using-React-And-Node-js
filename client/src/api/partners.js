import axios from './axios';

// Submit partner application
export const submitPartnerApplication = async (applicationData) => {
  const response = await axios.post('/partners/apply', applicationData);
  return response.data;
};

// Get all partner applications (admin only)
export const getAllPartnerApplications = async () => {
  const response = await axios.get('/partners/applications');
  return response.data;
};

// Get application by ID (admin only)
export const getPartnerApplicationById = async (id) => {
  const response = await axios.get(`/partners/applications/${id}`);
  return response.data;
};

// Update application status (admin only)
export const updatePartnerApplicationStatus = async (id, status, reviewNotes = '', margin) => {
  const response = await axios.put(`/partners/applications/${id}/status`, {
    status,
    reviewNotes,
    margin
  });
  
  return response.data;
}; 
