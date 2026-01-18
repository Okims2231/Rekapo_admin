import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { statisticsService } from '../services/statisticsService';
import useAuth from '../hooks/useAuth';
import backgroundImage from '../assets/images/lvl807.jpg';
import backgroundAudio from '../assets/audio/lvl807.mp3';
import CalculationPopup from '../components/popups/CalculationPopup';
import '../index.css';

export default function SystemStatistics() {
  const { logout } = useAuth();
  const audioRef = useRef(null);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showClickPrompt, setShowClickPrompt] = useState(true);
  const [popup, setPopup] = useState({ isOpen: false, message: '', type: 'success' });
  const pageSize = 10;

  // Auto-play background music
  useEffect(() => {
    const playAudio = async () => {
      try {
        if (audioRef.current) {
          audioRef.current.volume = 0.30;
          await audioRef.current.play();
        }
      } catch (err) {
        console.log('Auto-play prevented:', err);
      }
    };

    // Delay slightly to ensure volume is set before playing
    const timer = setTimeout(playAudio, 100);

    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.volume = 0.30;
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      setShowClickPrompt(false);
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleFirstClick);
    };
  }, []);

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

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCalculateToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await statisticsService.calculateStatistics(today);
      await fetchStatistics();
      setPopup({ 
        isOpen: true, 
        message: 'Statistics calculated successfully for today!', 
        type: 'success' 
      });
    } catch (err) {
      setPopup({ 
        isOpen: true, 
        message: `Error calculating statistics: ${err.message}`, 
        type: 'error' 
      });
    }
  };

  const handleDeleteStatistic = async (statId) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      try {
        await statisticsService.deleteStatistics(statId);
        await fetchStatistics();
        setPopup({ 
          isOpen: true, 
          message: 'Statistic deleted successfully!', 
          type: 'success' 
        });
      } catch (err) {
        setPopup({ 
          isOpen: true, 
          message: `Error deleting statistic: ${err.message}`, 
          type: 'error' 
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      console.warn('Logout API failed; clearing token locally');
      try {
        localStorage.removeItem('adminToken');
      } catch (ex) {
        console.warn('Failed to clear token:', ex);
      }
    } finally {
      window.location.assign('/login');
    }
  };

  const headerStyles = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 16,
    backgroundColor: 'rgba(50, 70, 50, 0.25)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid rgba(100, 150, 100, 0.2)'
  };

  const cardStyles = { 
    backgroundColor: 'rgba(60, 80, 60, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: 20, 
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    marginBottom: 16,
    border: '1px solid rgba(120, 160, 100, 0.15)'
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        padding: '24px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0
        }}></div>
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#ffffff',
          fontFamily: 'Verdana, sans-serif',
          fontSize: '18px',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          position: 'relative',
          zIndex: 1
        }}>Loading statistics...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '24px',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 0
      }}></div>

      {/* Background Audio */}
      <audio ref={audioRef} loop autoPlay>
        <source src={backgroundAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Click Prompt */}
      {showClickPrompt && (
        <div
          style={{
            position: 'fixed',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            padding: '10px 20px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeInPulse 2s ease-in-out infinite',
          }}
        >
          <style>
            {`
              @keyframes fadeInPulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 0.9; }
              }
            `}
          </style>
          <div
            style={{
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              fontSize: '13px',
              fontWeight: 400,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              letterSpacing: '0.3px',
            }}
          >
            ✨ click anywhere to feel the liminality ✨
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Navigation Header */}
        <div style={headerStyles}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>System Statistics</h1>
            <div style={{ 
              color: '#cacacaff', 
              marginTop: 6, 
              textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>View and manage system statistics</div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              style={{ 
                padding: '10px 20px', 
                borderRadius: '25px', 
                border: '2px solid rgba(100, 180, 90, 0.6)', 
                background: 'linear-gradient(135deg, rgba(100, 180, 90, 0.9), rgba(80, 160, 70, 0.9))', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'default',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(100, 180, 90, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              📊 Statistics
            </button>

            <Link to="/users">
              <button 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255,255,255,0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                👥 Users
              </button>
            </Link>

            <Link to="/sessions">
              <button 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255,255,255,0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                🎮 Sessions
              </button>
            </Link>

            <Link to="/admin">
              <button 
                style={{ 
                  padding: '10px 20px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(255,255,255,0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                🏠 Dashboard
              </button>
            </Link>

            <button 
              onClick={handleLogout}
              style={{ 
                padding: '10px 20px', 
                borderRadius: '25px', 
                border: '2px solid rgba(239, 68, 68, 0.6)', 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'pointer',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1))';
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Action Buttons Card */}
        <div style={cardStyles}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#ffffffff', 
                textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
                fontFamily: 'Verdana, sans-serif' 
              }}>Actions</h2>
              <div style={{ 
                color: '#cacacaff', 
                marginTop: 6, 
                textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
                fontFamily: 'Verdana, sans-serif' 
              }}>Calculate new statistics</div>
            </div>

            <button
              onClick={handleCalculateToday}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                border: 'none',
                background: 'rgba(100, 180, 90, 0.8)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 500,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(100, 180, 90, 1)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(100, 180, 90, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(100, 180, 90, 0.8)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              📊 Calculate Today's Statistics
            </button>
          </div>
        </div>

        {error && (
          <div style={{ 
            color: '#ffffff', 
            marginBottom: '20px', 
            padding: '16px', 
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '20px',
            fontFamily: 'Verdana, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            Error: {error}
          </div>
        )}

        {/* Statistics Table Card */}
        {statistics && statistics.statistics && statistics.statistics.length > 0 ? (
          <div style={cardStyles}>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>Statistics Data</h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                <thead>
                  <tr style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                    backdropFilter: 'blur(8px)'
                  }}>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Date</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Total Users</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Active Users</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Total Sessions</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Avg Duration (min)</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Calculated At</th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'center', 
                      color: '#ffffff',
                      fontWeight: 600,
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.statistics.map((stat, index) => (
                    <tr 
                      key={stat.id} 
                      style={{ 
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
                      }}
                    >
                      <td style={{ 
                        padding: '12px', 
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>{stat.stat_date}</td>
                      <td style={{ 
                        padding: '12px', 
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>{stat.total_users ?? 'N/A'}</td>
                      <td style={{ 
                        padding: '12px', 
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>{stat.active_users ?? 'N/A'}</td>
                      <td style={{ 
                        padding: '12px', 
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>{stat.total_sessions ?? 'N/A'}</td>
                      <td style={{ 
                        padding: '12px', 
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>
                        {stat.average_session_duration ? stat.average_session_duration.toFixed(2) : 'N/A'}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                      }}>
                        {new Date(stat.calculated_at).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteStatistic(stat.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.8)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontFamily: 'Verdana, sans-serif',
                            fontSize: '14px',
                            fontWeight: 500,
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 1)';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(239, 68, 68, 0.8)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', alignItems: 'center' }}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: page === 1 ? 'rgba(156, 163, 175, 0.5)' : 'rgba(34, 197, 94, 0.8)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (page !== 1) {
                    e.target.style.background = 'rgba(34, 197, 94, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== 1) {
                    e.target.style.background = 'rgba(34, 197, 94, 0.8)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                ← Previous
              </button>
              
              <span style={{ 
                padding: '8px 16px', 
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}>
                Page {statistics.page} of {Math.ceil(statistics.total / pageSize)}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={statistics.page * pageSize >= statistics.total}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: statistics.page * pageSize >= statistics.total ? 'rgba(156, 163, 175, 0.5)' : 'rgba(34, 197, 94, 0.8)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  cursor: statistics.page * pageSize >= statistics.total ? 'not-allowed' : 'pointer',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (statistics.page * pageSize < statistics.total) {
                    e.target.style.background = 'rgba(34, 197, 94, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (statistics.page * pageSize < statistics.total) {
                    e.target.style.background = 'rgba(34, 197, 94, 0.8)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                Next →
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            ...cardStyles,
            textAlign: 'center'
          }}>
            <p style={{
              color: '#cacacaff',
              fontFamily: 'Verdana, sans-serif',
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontSize: '16px'
            }}>
              No statistics available. Click "Calculate Today's Statistics" to generate data.
            </p>
          </div>
        )}
      </div>

      {/* Calculation Popup */}
      <CalculationPopup
        message={popup.message}
        type={popup.type}
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
      />
    </div>
  );
}