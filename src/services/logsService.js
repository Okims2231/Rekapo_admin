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
    console.error('Logs API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

export const logsService = {
  /**
   * Get daily log summary from database
   */
  async getLogSummary(date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await axiosInstance.get(`/admin/logs/summary${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch log summary:', errorMsg);
      throw new Error(`Failed to fetch log summary: ${errorMsg}`);
    }
  },

  /**
   * Get recent logs from database, optionally filter by level
   */
  async getRecentLogs(limit = 100, level = null, hours = 24, userEmail = null) {
    try {
      const params = new URLSearchParams({ limit, hours });
      if (level) params.append('level', level);
      if (userEmail) params.append('user_email', userEmail);
      const response = await axiosInstance.get(`/admin/logs/recent?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch recent logs:', errorMsg);
      throw new Error(`Failed to fetch recent logs: ${errorMsg}`);
    }
  },

  /**
   * Get all errors from the last N hours
   */
  async getRecentErrors(hours = 24) {
    try {
      const response = await axiosInstance.get(`/admin/logs/errors/recent?hours=${hours}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch recent errors:', errorMsg);
      throw new Error(`Failed to fetch recent errors: ${errorMsg}`);
    }
  },

  /**
   * Get top error messages for the last N hours
   */
  async getTopErrors(hours = 24, limit = 10) {
    try {
      const params = new URLSearchParams({ hours, limit });
      const response = await axiosInstance.get(`/admin/logs/top-errors?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch top errors:', errorMsg);
      throw new Error(`Failed to fetch top errors: ${errorMsg}`);
    }
  },

  /**
   * Get users with most errors for the last N hours
   */
  async getTopErrorUsers(hours = 24, limit = 10) {
    try {
      const params = new URLSearchParams({ hours, limit });
      const response = await axiosInstance.get(`/admin/logs/top-error-users?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch top error users:', errorMsg);
      throw new Error(`Failed to fetch top error users: ${errorMsg}`);
    }
  },

  /**
   * Delete logs older than specified days
   */
  async cleanupOldLogs(days = 30) {
    try {
      const response = await axiosInstance.delete(`/admin/logs/cleanup?days=${days}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to cleanup logs:', errorMsg);
      throw new Error(`Failed to cleanup logs: ${errorMsg}`);
    }
  },

  /**
   * Get log statistics for dashboard widgets
   */
  async getLogStats(hours = 24) {
    try {
      const response = await axiosInstance.get(`/admin/logs/stats?hours=${hours}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch log stats:', errorMsg);
      throw new Error(`Failed to fetch log stats: ${errorMsg}`);
    }
  },

  /**
   * Search logs by user ID
   */
  async searchLogsByUserId(userId, hours = 24, level = null) {
    try {
      const params = new URLSearchParams({ hours });
      if (level) params.append('level', level);
      const response = await axiosInstance.get(`/admin/logs/user/${userId}?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to search logs by user ID:', errorMsg);
      throw new Error(`Failed to search logs by user ID: ${errorMsg}`);
    }
  },

  /**
   * Search logs by user email
   */
  async searchLogsByEmail(email, hours = 24, level = null) {
    try {
      const params = new URLSearchParams({ hours });
      if (level) params.append('level', level);
      const response = await axiosInstance.get(`/admin/logs/user/email/${encodeURIComponent(email)}?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to search logs by email:', errorMsg);
      throw new Error(`Failed to search logs by email: ${errorMsg}`);
    }
  },
};

export default logsService;
