import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response error interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Session API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

export const sessionService = {
  /**
   * Get paginated list of sessions
   */
  async getSessions(page = 1, pageSize = 20, search = null, status = null, trainingConsent = null, isDeleted = null) {
    try {
      const params = new URLSearchParams({
        page,
        page_size: pageSize,
      });

      // Filter by user_id if search is a number, otherwise search by session_title
      if (search) {
        if (!isNaN(search)) {
          params.append('user_id', search);
        } else {
          params.append('session_title', search);
        }
      }
      if (status) params.append('status', status);
      if (trainingConsent !== null && trainingConsent !== '') params.append('training_consent', trainingConsent);
      if (isDeleted !== null && isDeleted !== '') params.append('is_deleted', isDeleted);

      const response = await axiosInstance.get(`/admin/sessions?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch sessions:', error.response?.data || errorMsg);
      throw new Error(typeof errorMsg === 'string' ? `Failed to fetch sessions: ${errorMsg}` : 'Failed to fetch sessions');
    }
  },

  /**
   * Get session by ID
   */
  async getSessionById(sessionId) {
    try {
      const response = await axiosInstance.get(`/admin/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch session by ID:', errorMsg);
      throw new Error(`Failed to fetch session: ${errorMsg}`);
    }
  },

  /**
   * Get sessions by user ID
   */
  async getSessionsByUserId(userId, page = 1, pageSize = 20) {
    try {
      const response = await axiosInstance.get(`/admin/users/${userId}/sessions?page=${page}&page_size=${pageSize}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch sessions by user ID:', errorMsg);
      throw new Error(`Failed to fetch sessions: ${errorMsg}`);
    }
  },

  /**
   * Delete a session
   */
  async deleteSession(sessionId, reason = null) {
    try {
      const response = await axiosInstance.delete(`/admin/sessions/${sessionId}`, {
        data: { reason },
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to delete session:', errorMsg);
      throw new Error(`Failed to delete session: ${errorMsg}`);
    }
  },

  /**
   * Update session status
   */
  async updateSessionStatus(sessionId, status) {
    try {
      const response = await axiosInstance.put(`/admin/sessions/${sessionId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to update session status:', errorMsg);
      throw new Error(`Failed to update session: ${errorMsg}`);
    }
  },

  /**
   * End a session
   */
  async endSession(sessionId) {
    try {
      const response = await axiosInstance.post(`/admin/sessions/${sessionId}/end`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to end session:', errorMsg);
      throw new Error(`Failed to end session: ${errorMsg}`);
    }
  },

  /**
   * Get training data for a session (enforces consent check)
   */
  async getTrainingData(sessionId) {
    try {
      const response = await axiosInstance.get(`/admin/training-data/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch training data:', errorMsg);
      throw new Error(`Failed to fetch training data: ${errorMsg}`);
    }
  },
};

export default sessionService;
