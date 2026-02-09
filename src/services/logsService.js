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
   * List all log files, optionally filtered by date
   */
  async getLogFiles(date = null) {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await axiosInstance.get(`/api/logs/files${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch log files:', errorMsg);
      throw new Error(`Failed to fetch log files: ${errorMsg}`);
    }
  },

  /**
   * View contents of a specific log file, optionally filter by level
   */
  async viewLogFile(filePath, level = null) {
    try {
      const params = level ? `?level=${level}` : '';
      const response = await axiosInstance.get(`/api/logs/view/${filePath}${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to view log file:', errorMsg);
      throw new Error(`Failed to view log file: ${errorMsg}`);
    }
  },

  /**
   * Get all errors from the last N hours
   */
  async getRecentErrors(hours = 24) {
    try {
      const response = await axiosInstance.get(`/api/logs/errors/recent?hours=${hours}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch recent errors:', errorMsg);
      throw new Error(`Failed to fetch recent errors: ${errorMsg}`);
    }
  },

  /**
   * Delete logs older than specified days
   */
  async cleanupOldLogs(days = 30) {
    try {
      const response = await axiosInstance.delete(`/api/logs/cleanup?days=${days}`);
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
      const response = await axiosInstance.get(`/api/logs/stats?hours=${hours}`);
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
      const response = await axiosInstance.get(`/api/logs/user/${userId}?${params}`);
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
      const response = await axiosInstance.get(`/api/logs/user/email/${encodeURIComponent(email)}?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to search logs by email:', errorMsg);
      throw new Error(`Failed to search logs by email: ${errorMsg}`);
    }
  },
};

export default logsService;
