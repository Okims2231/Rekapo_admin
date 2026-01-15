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
    console.error('Statistics API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

export const statisticsService = {
  /**
   * Get paginated list of system statistics
   */
  async getStatistics(page = 1, pageSize = 20, startDate = null, endDate = null) {
    try {
      const params = new URLSearchParams({
        page,
        page_size: pageSize,
      });

      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await axiosInstance.get(`/admin/statistics?${params}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch statistics:', errorMsg);
      throw new Error(`Failed to fetch statistics: ${errorMsg}`);
    }
  },

  /**
   * Get system statistics by ID
   */
  async getStatisticsById(statId) {
    try {
      const response = await axiosInstance.get(`/admin/statistics/${statId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch statistics by ID:', errorMsg);
      throw new Error(`Failed to fetch statistics: ${errorMsg}`);
    }
  },

  /**
   * Get system statistics by date
   */
  async getStatisticsByDate(date) {
    try {
      const response = await axiosInstance.get(`/admin/statistics/date/${date}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to fetch statistics by date:', errorMsg);
      throw new Error(`Failed to fetch statistics: ${errorMsg}`);
    }
  },

  /**
   * Create new system statistics entry
   */
  async createStatistics(statDate, totalUsers, activeUsers, totalSessions, avgSessionDuration) {
    try {
      const response = await axiosInstance.post('/admin/statistics', {
        stat_date: statDate,
        total_users: totalUsers,
        active_users: activeUsers,
        total_sessions: totalSessions,
        average_session_duration: avgSessionDuration,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to create statistics:', errorMsg);
      throw new Error(`Failed to create statistics: ${errorMsg}`);
    }
  },

  /**
   * Update existing system statistics
   */
  async updateStatistics(statId, totalUsers, activeUsers, totalSessions, avgSessionDuration) {
    try {
      const response = await axiosInstance.put(`/admin/statistics/${statId}`, {
        total_users: totalUsers,
        active_users: activeUsers,
        total_sessions: totalSessions,
        average_session_duration: avgSessionDuration,
      });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to update statistics:', errorMsg);
      throw new Error(`Failed to update statistics: ${errorMsg}`);
    }
  },

  /**
   * Delete system statistics entry
   */
  async deleteStatistics(statId) {
    try {
      const response = await axiosInstance.delete(`/admin/statistics/${statId}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to delete statistics:', errorMsg);
      throw new Error(`Failed to delete statistics: ${errorMsg}`);
    }
  },

  /**
   * Calculate and store statistics for a specific date
   */
  async calculateStatistics(date) {
    try {
      const response = await axiosInstance.post(`/admin/statistics/calculate/${date}`);
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || 'Unknown error';
      console.error('Failed to calculate statistics:', errorMsg);
      throw new Error(`Failed to calculate statistics: ${errorMsg}`);
    }
  },
};
