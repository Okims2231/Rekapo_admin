import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

export default function SystemStatistics() {
  const { queryStatistics } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = () => {
    setLoading(true);
    setTimeout(() => {
      setStats(queryStatistics());
      setLoading(false);
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#f9f9f9' }}>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', maxWidth: 700, margin: '0 auto', borderRadius: 8, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>System Statistics</h2>
          <button onClick={() => navigate('/')} style={{ padding: '6px 10px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>Back to Admin</button>
        </div>
        <button onClick={handleQuery} disabled={loading} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>
          {loading ? 'Querying...' : 'Query Statistics'}
        </button>

        {stats && (
          <div style={{ marginTop: 16 }}>
            <div><strong>Total Users:</strong> {stats.totalUsers}</div>
            <div><strong>Active Sessions:</strong> {stats.activeSessions}</div>
            <div><strong>Last Login:</strong> {stats.lastLogin}</div>
            <div><strong>System Load:</strong> {stats.systemLoad}</div>
          </div>
        )}
      </div>
    </div>
  );
}
