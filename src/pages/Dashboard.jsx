import { useState, useEffect } from 'react';
import { statisticsService } from '../services/statisticsService';
import '../index.css';

export default function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchStatistics();
  }, [page]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getStatistics(page, pageSize);
      setStatistics(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await statisticsService.calculateStatistics(today);
      await fetchStatistics();
      alert('Statistics calculated successfully for today!');
    } catch (err) {
      alert(`Error calculating statistics: ${err.message}`);
    }
  };

  const handleDeleteStatistic = async (statId) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await statisticsService.deleteStatistics(statId);
        await fetchStatistics();
        alert('Statistic deleted successfully!');
      } catch (err) {
        alert(`Error deleting statistic: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading statistics...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>System Dashboard</h1>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCalculateToday}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Calculate Today's Statistics
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}

      {statistics && statistics.statistics && statistics.statistics.length > 0 ? (
        <div>
          <h2>System Statistics</h2>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              backgroundColor: '#f9f9f9',
              border: '1px solid #ddd',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>Total Users</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>Active Users</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>Total Sessions</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>Avg Duration (min)</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: '1px solid #ddd' }}>Calculated At</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {statistics.statistics.map((stat) => (
                <tr key={stat.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>{stat.stat_date}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>{stat.total_users ?? 'N/A'}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>{stat.active_users ?? 'N/A'}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>{stat.total_sessions ?? 'N/A'}</td>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>
                    {stat.average_session_duration ? stat.average_session_duration.toFixed(2) : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', borderRight: '1px solid #ddd' }}>
                    {new Date(stat.calculated_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteStatistic(stat.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: page === 1 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 16px', fontWeight: 'bold' }}>
              Page {statistics.page} of {Math.ceil(statistics.total / pageSize)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={statistics.page * pageSize >= statistics.total}
              style={{
                padding: '8px 16px',
                backgroundColor: statistics.page * pageSize >= statistics.total ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: statistics.page * pageSize >= statistics.total ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', textAlign: 'center' }}>
          <p>No statistics available. Click "Calculate Today's Statistics" to generate data.</p>
        </div>
      )}
    </div>
  );
}