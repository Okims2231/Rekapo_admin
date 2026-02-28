import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/images/lvl807.jpg';
import backgroundAudio from '../assets/audio/lvl807.mp3';
import CalculationPopup from '../components/popups/CalculationPopup';
import Lvl807 from '../components/AdminFeatures/lvl807';
import FlytrapHumanoid from '../components/AdminFeatures/FlytrapHumanoid';
import '../index.css';

export default function SystemStatistics() {
  const { logout } = useAuth();
  const audioRef = useRef(null);
  const [statisticsData, setStatisticsData] = useState([
    { id: 1, stat_date: '2026-02-28', total_users: 1247, active_users: 389, total_sessions: 5621, average_session_duration: 34.56, calculated_at: '2026-02-28T14:30:00Z' },
    { id: 2, stat_date: '2026-02-27', total_users: 1231, active_users: 376, total_sessions: 5489, average_session_duration: 33.21, calculated_at: '2026-02-27T14:30:00Z' },
    { id: 3, stat_date: '2026-02-26', total_users: 1215, active_users: 362, total_sessions: 5312, average_session_duration: 32.87, calculated_at: '2026-02-26T14:30:00Z' },
    { id: 4, stat_date: '2026-02-25', total_users: 1198, active_users: 348, total_sessions: 5156, average_session_duration: 31.45, calculated_at: '2026-02-25T14:30:00Z' },
    { id: 5, stat_date: '2026-02-24', total_users: 1182, active_users: 334, total_sessions: 4987, average_session_duration: 30.12, calculated_at: '2026-02-24T14:30:00Z' },
    { id: 6, stat_date: '2026-02-23', total_users: 1165, active_users: 321, total_sessions: 4823, average_session_duration: 29.78, calculated_at: '2026-02-23T14:30:00Z' },
    { id: 7, stat_date: '2026-02-22', total_users: 1149, active_users: 307, total_sessions: 4656, average_session_duration: 28.34, calculated_at: '2026-02-22T14:30:00Z' },
    { id: 8, stat_date: '2026-02-21', total_users: 1132, active_users: 293, total_sessions: 4512, average_session_duration: 27.91, calculated_at: '2026-02-21T14:30:00Z' },
    { id: 9, stat_date: '2026-02-20', total_users: 1116, active_users: 279, total_sessions: 4389, average_session_duration: 26.56, calculated_at: '2026-02-20T14:30:00Z' },
    { id: 10, stat_date: '2026-02-19', total_users: 1099, active_users: 265, total_sessions: 4234, average_session_duration: 25.23, calculated_at: '2026-02-19T14:30:00Z' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState({ isOpen: false, message: '', type: 'success' });
  const [showLorePopup, setShowLorePopup] = useState(false);
  const [showFlytrapPopup, setShowFlytrapPopup] = useState(false);
  const pageSize = 10;

  // Auto-play background music
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Force volume to always be 0.3
    const forceVolume = () => {
      if (audio.volume !== 0.3) {
        audio.volume = 0.3;
      }
    };

    // Set initial volume
    audio.volume = 0.3;

    // Add listener to prevent volume from changing
    audio.addEventListener('volumechange', forceVolume);

    // Play audio
    audio.play().catch(err => {
      console.log('Auto-play prevented:', err);
    });

    // Click handler fallback
    const handleFirstClick = () => {
      if (audio && audio.paused) {
        audio.volume = 0.3;
        audio.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      audio.removeEventListener('volumechange', forceVolume);
      document.removeEventListener('click', handleFirstClick);
    };
  }, [loading]);

  const fetchStatistics = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const paginatedStats = statisticsData.slice(start, start + pageSize);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchStatistics();
  }, [page]);

  const handleDeleteStatistic = (statId) => {
    if (window.confirm('Are you sure you want to delete this statistic?')) {
      setStatisticsData(statisticsData.filter(s => s.id !== statId));
      setPopup({ 
        isOpen: true, 
        message: 'Statistic deleted successfully!', 
        type: 'success' 
      });
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
    <>
      <style>{`
        /* Hide scrollbar completely - prevent layout shift */
        ::-webkit-scrollbar {
          display: none;
        }
        
        html {
          scrollbar-width: none; /* Firefox */
        }
        
        body {
          overflow-y: scroll; /* Always allocate space for scrollbar (doesn't show) */
        }
      `}</style>
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
      <audio ref={audioRef} loop>
        <source src={backgroundAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Lore Button - Fixed Upper Right */}
      <button 
        onClick={() => setShowLorePopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(120, 160, 100, 0.4)', 
          background: 'rgba(60, 80, 60, 0.5)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer',
          color: '#ffffff',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(60, 80, 60, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(60, 80, 60, 0.5)';
        }}
      >
        Level 807 Lore
      </button>

      {/* Flytrap Humanoid Button - Fixed Upper Left */}
      <button 
        onClick={() => setShowFlytrapPopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(120, 160, 100, 0.4)', 
          background: 'rgba(60, 80, 60, 0.5)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer',
          color: '#ffffff',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(60, 80, 60, 0.8)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(60, 80, 60, 0.5)';
        }}
      >
        Flytrap Humanoid
      </button>

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

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button 
              style={{ 
                padding: '8px 14px', 
                borderRadius: '25px', 
                border: '2px solid rgba(100, 180, 90, 0.6)', 
                background: 'linear-gradient(135deg, rgba(100, 180, 90, 0.9), rgba(80, 160, 70, 0.9))', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'default',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(100, 180, 90, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Statistics
            </button>

            <Link to="/users">
              <button 
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
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
                Users
              </button>
            </Link>

            <Link to="/user-analytics">
              <button 
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
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
                User Analytics
              </button>
            </Link>

            <Link to="/sessions">
              <button 
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
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
                Sessions
              </button>
            </Link>

            <Link to="/logs">
              <button 
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
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
                App Logs
              </button>
            </Link>

            <Link to="/">
              <button 
                style={{ 
                  padding: '8px 14px', 
                  borderRadius: '25px', 
                  border: '2px solid rgba(255, 255, 255, 0.2)', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
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
                Dashboard
              </button>
            </Link>

            <button 
              onClick={handleLogout}
              style={{ 
                padding: '8px 14px', 
                borderRadius: '25px', 
                border: '2px solid rgba(239, 68, 68, 0.6)', 
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'pointer',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
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
              Logout
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
        {statisticsData && statisticsData.length > 0 ? (
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
                  {statisticsData.slice((page - 1) * pageSize, page * pageSize).map((stat, index) => (
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
                Page {page} of {Math.ceil(statisticsData.length / pageSize)}
              </span>
              
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= statisticsData.length}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: page * pageSize >= statisticsData.length ? 'rgba(156, 163, 175, 0.5)' : 'rgba(34, 197, 94, 0.8)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  cursor: page * pageSize >= statisticsData.length ? 'not-allowed' : 'pointer',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (page * pageSize < statisticsData.length) {
                    e.target.style.background = 'rgba(34, 197, 94, 1)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page * pageSize < statisticsData.length) {
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

      {/* Lore Popup */}
      <Lvl807
        isOpen={showLorePopup}
        onClose={() => setShowLorePopup(false)}
      />

      {/* Flytrap Humanoid Popup */}
      <FlytrapHumanoid
        isOpen={showFlytrapPopup}
        onClose={() => setShowFlytrapPopup(false)}
      />
      </div>
    </>
  );
}