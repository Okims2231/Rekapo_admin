import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { logsService } from '../services/logsService';
import useAuth from '../hooks/useAuth';
import backgroundImage from '../assets/images/level 7232003.jpg';
import backgroundAudio from '../assets/audio/the void.mp3';
import CalculationPopup from '../components/popups/CalculationPopup';
import Lvl807 from '../components/AdminFeatures/lvl807';
import FlytrapHumanoid from '../components/AdminFeatures/FlytrapHumanoid';
import Lvl7232003Entities from '../components/AdminFeatures/lvl7232003entities';
import AstralBrineLore from '../components/AdminFeatures/AstralBrineLore';
import '../index.css';

export default function AdminLogs() {
  const { logout } = useAuth();
  const audioRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [recentErrors, setRecentErrors] = useState(null);
  const [recentLogs, setRecentLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterHours, setFilterHours] = useState(24);
  const [recentLogsLimit, setRecentLogsLimit] = useState(100);
  const [userSearch, setUserSearch] = useState('');
  const [searchType, setSearchType] = useState('email');
  const [searchResults, setSearchResults] = useState(null);
  const [searchMode, setSearchMode] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, message: '', type: 'success' });
  const [showLorePopup, setShowLorePopup] = useState(false);
  const [showFlytrapPopup, setShowFlytrapPopup] = useState(false);
  const [showTopErrorsPopup, setShowTopErrorsPopup] = useState(false);
  const [showTopUsersPopup, setShowTopUsersPopup] = useState(false);
  const [showEntitiesPopup, setShowEntitiesPopup] = useState(false);
  const [showAstralBrinePopup, setShowAstralBrinePopup] = useState(false);
  const [topErrors, setTopErrors] = useState([]);
  const [topErrorUsers, setTopErrorUsers] = useState([]);

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

  const fetchStats = async () => {
    try {
      const data = await logsService.getLogStats(filterHours);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const fetchRecentErrors = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getRecentErrors(filterHours);
      setRecentErrors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recent errors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsService.getRecentLogs(
        recentLogsLimit,
        filterLevel || null,
        filterHours
      );
      setRecentLogs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recent logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeTopErrors = (data) => {
    const items = Array.isArray(data)
      ? data
      : data?.errors || data?.items || data?.results || [];

    return items
      .map((item) => ({
        message: item.message || item.error || item.text || 'Unknown error',
        count: item.count ?? item.error_count ?? item.total ?? 0
      }))
      .filter((item) => item.count > 0);
  };

  const normalizeTopErrorUsers = (data) => {
    const items = Array.isArray(data)
      ? data
      : data?.users || data?.items || data?.results || [];

    return items
      .map((item) => ({
        email: item.email || item.user_email || (item.user_id ? `User ${item.user_id}` : 'Unknown'),
        count: item.count ?? item.error_count ?? item.total ?? 0
      }))
      .filter((item) => item.count > 0);
  };

  const fetchTopErrors = async () => {
    try {
      const data = await logsService.getTopErrors(filterHours, 20);
      setTopErrors(normalizeTopErrors(data));
    } catch (err) {
      console.error('Error fetching top errors:', err);
    }
  };

  const fetchTopErrorUsers = async () => {
    try {
      const data = await logsService.getTopErrorUsers(filterHours, 20);
      setTopErrorUsers(normalizeTopErrorUsers(data));
    } catch (err) {
      console.error('Error fetching top error users:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentErrors();
    fetchRecentLogs();
    fetchTopErrors();
    fetchTopErrorUsers();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchRecentErrors();
      fetchRecentLogs();
      fetchTopErrors();
      fetchTopErrorUsers();
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterHours, filterLevel, recentLogsLimit]);

  const handleUserSearch = async () => {
    if (!userSearch.trim()) {
      setPopup({ isOpen: true, message: 'Please enter a user email or ID', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let data;
      
      if (searchType === 'email') {
        data = await logsService.searchLogsByEmail(userSearch, filterHours, filterLevel || null);
      } else {
        const userId = parseInt(userSearch);
        if (isNaN(userId)) {
          throw new Error('User ID must be a number');
        }
        data = await logsService.searchLogsByUserId(userId, filterHours, filterLevel || null);
      }
      
      setSearchResults(data);
      setSearchMode(true);
      setPopup({ isOpen: true, message: `Found ${data.count} logs`, type: 'success' });
    } catch (err) {
      setError(err.message);
      setPopup({ isOpen: true, message: err.message, type: 'error' });
      console.error('Error searching user logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearUserSearch = () => {
    setSearchMode(false);
    setUserSearch('');
    setSearchResults(null);
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
    backgroundColor: 'rgba(30, 20, 50, 0.25)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid rgba(100, 80, 180, 0.2)'
  };

  const cardStyles = { 
    backgroundColor: 'rgba(40, 30, 60, 0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '20px',
    padding: 20, 
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    marginBottom: 16,
    border: '1px solid rgba(120, 100, 180, 0.15)'
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error':
        return '#ef4444';
      case 'warn':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      case 'network':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getLevelBadgeStyle = (level) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    backgroundColor: getLevelColor(level),
    color: '#ffffff',
    display: 'inline-block',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  });

  if (loading && !recentErrors && !recentLogs) {
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}></div>
        
        <div style={{ 
          color: '#ffffff', 
          fontSize: '20px', 
          textAlign: 'center',
          zIndex: 1,
          fontFamily: 'Verdana, sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)'
        }}>
          Loading logs...
        </div>
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
      position: 'relative',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Background overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 0
      }}></div>

      {/* Background music */}
      <audio ref={audioRef} loop>
        <source src={backgroundAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Easter eggs */}
      <Lvl807 onActivate={() => setShowLorePopup(true)} />
      <FlytrapHumanoid onActivate={() => setShowFlytrapPopup(true)} />

      {/* Entities Button - Upper Left */}
      <button 
        onClick={() => setShowEntitiesPopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(168, 85, 247, 0.4)', 
          background: 'rgba(0, 0, 0, 0.4)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer',
          color: '#c084fc',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)';
          e.target.style.borderColor = 'rgba(168, 85, 247, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.4)';
          e.target.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        }}
      >
        ✦ Entity
      </button>

      {/* Level 7232003 Button - Upper Right */}
      <button 
        onClick={() => setShowAstralBrinePopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(168, 85, 247, 0.4)', 
          background: 'rgba(0, 0, 0, 0.4)', 
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          cursor: 'pointer',
          color: '#c084fc',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)';
          e.target.style.borderColor = 'rgba(168, 85, 247, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.4)';
          e.target.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        }}
      >
        ✦ Level 7,232,003
      </button>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={headerStyles}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px',
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.8)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>Application Logs</h1>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#cacacaff', 
              textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>Monitor and analyze application errors and events</p>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link to="/statistics">
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
                Statistics
              </button>
            </Link>

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

            <button 
              style={{ 
                padding: '8px 14px', 
                borderRadius: '25px', 
                border: '2px solid rgba(100, 120, 180, 0.6)', 
                background: 'linear-gradient(135deg, rgba(100, 120, 180, 0.9), rgba(80, 100, 160, 0.9))', 
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
              App Logs
            </button>

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

        {/* Statistics Cards */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: 16, 
            marginBottom: 16 
          }}>
            <div style={cardStyles}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: '#3b82f6',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                {stats.total_logs}
              </h3>
              <div style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Total Logs (Last {filterHours}h)
              </div>
            </div>

            <div style={cardStyles}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: '#ef4444',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                {stats.errors}
              </h3>
              <div style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Errors (Last {filterHours}h)
              </div>
            </div>

            <div style={cardStyles}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: '#f59e0b',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                {stats.warnings}
              </h3>
              <div style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Warnings (Last {filterHours}h)
              </div>
            </div>

            <div style={cardStyles}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                color: '#a855f7',
                fontSize: '32px',
                fontWeight: 'bold',
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 2px 4px rgba(0,0,0,0.6)'
              }}>
                {stats.info}
              </h3>
              <div style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Info Logs (Last {filterHours}h)
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={cardStyles}>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            color: '#ffffffff', 
            textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
            fontFamily: 'Verdana, sans-serif' 
          }}>Filters</h2>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                marginRight: '8px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Time Range:
              </label>
              <select
                value={filterHours}
                onChange={(e) => setFilterHours(Number(e.target.value))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(100, 120, 180, 0.3)',
                  background: 'rgba(30, 25, 50, 0.8)',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                <option value={1}>Last 1 hour</option>
                <option value={6}>Last 6 hours</option>
                <option value={24}>Last 24 hours</option>
                <option value={168}>Last 7 days</option>
              </select>
            </div>

            <div>
              <label style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                marginRight: '8px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Log Level:
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(100, 120, 180, 0.3)',
                  background: 'rgba(30, 25, 50, 0.8)',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                <option value="">All Levels</option>
                <option value="error">Errors</option>
                <option value="warn">Warnings</option>
                <option value="info">Info</option>
                <option value="network">Network</option>
              </select>
            </div>

            <div>
              <label style={{ 
                color: '#cacacaff', 
                fontSize: '14px',
                marginRight: '8px',
                fontFamily: 'Verdana, sans-serif'
              }}>
                Logs Limit:
              </label>
              <select
                value={recentLogsLimit}
                onChange={(e) => setRecentLogsLimit(Number(e.target.value))}
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid rgba(100, 120, 180, 0.3)',
                  background: 'rgba(30, 25, 50, 0.8)',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                <option value={50}>50 logs</option>
                <option value={100}>100 logs</option>
                <option value={200}>200 logs</option>
                <option value={500}>500 logs</option>
              </select>
            </div>

            <button
              onClick={() => {
                fetchStats();
                fetchRecentErrors();
                fetchRecentLogs();
                fetchTopErrors();
                fetchTopErrorUsers();
              }}
              style={{
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(100, 120, 180, 0.8)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 500
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* User Search */}
        <div style={cardStyles}>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            color: '#ffffffff', 
            textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
            fontFamily: 'Verdana, sans-serif' 
          }}>Search Logs by User</h2>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(100, 120, 180, 0.3)',
                background: 'rgba(30, 25, 50, 0.8)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif'
              }}
            >
              <option value="email">Email</option>
              <option value="id">User ID</option>
            </select>

            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder={searchType === 'email' ? 'Enter user email' : 'Enter user ID'}
              style={{
                padding: '8px 12px',
                borderRadius: '12px',
                border: '1px solid rgba(100, 120, 180, 0.3)',
                background: 'rgba(30, 25, 50, 0.8)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                minWidth: '250px'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUserSearch();
                }
              }}
            />

            <button
              onClick={handleUserSearch}
              style={{
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(100, 120, 180, 0.8)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 500
              }}
            >
              Search
            </button>

            {searchMode && (
              <button
                onClick={clearUserSearch}
                style={{
                  padding: '8px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(180, 60, 100, 0.8)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500
                }}
              >
                Clear Search
              </button>
            )}


            <button
              onClick={() => setShowTopErrorsPopup(true)}
              style={{
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.8)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 500
              }}
            >
              ⚠️ Top Error Messages
            </button>

            <button
              onClick={() => setShowTopUsersPopup(true)}
              style={{
                padding: '8px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(156, 163, 175, 0.8)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 500
              }}
            >
              👥 Users with Most Errors
            </button>


          </div>

          {searchMode && searchResults && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: '12px',
              background: 'rgba(100, 120, 180, 0.2)',
              border: '1px solid rgba(100, 120, 180, 0.3)'
            }}>
              <div style={{ 
                color: '#64b5f6', 
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.4)'
              }}>
                ✓ Found {searchResults.count} logs {searchType === 'email' ? `for ${searchResults.email}` : `for User ID ${searchResults.user_id}`}
              </div>
            </div>
          )}
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

        {/* Recent Errors */}
        {recentErrors && recentErrors.errors && recentErrors.errors.length > 0 && !searchMode && (
          <div style={cardStyles}>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>Recent Errors</h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Verdana, sans-serif' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {recentErrors.errors.map((err, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', color: '#cacacaff', fontSize: '13px' }}>
                        {new Date(err.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#cacacaff', fontSize: '13px' }}>
                        {err.user_email || (err.user_id ? `User ${err.user_id}` : 'Unknown User')}
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>ID: {err.user_id || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#ffffff', fontSize: '13px', maxWidth: '400px' }}>
                        {err.message}
                        {err.app_version && (
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                            App: {err.app_version} • Platform: {err.platform || 'N/A'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Search Results */}
        {searchMode && searchResults && searchResults.logs && searchResults.logs.length > 0 && (
          <div style={cardStyles}>
            <h2 style={{ 
              margin: '0 0 16px 0', 
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
              fontFamily: 'Verdana, sans-serif' 
            }}>
              User Search Results - {searchResults.count} logs found
            </h2>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Verdana, sans-serif' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Level</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.logs.map((log, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', color: '#cacacaff', fontSize: '13px' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#cacacaff', fontSize: '13px' }}>
                        {log.user_email || (log.user_id ? `User ${log.user_id}` : 'Unknown User')}
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>ID: {log.user_id || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={getLevelBadgeStyle(log.level)}>
                          {log.level}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#ffffff', fontSize: '13px', maxWidth: '400px' }}>
                        {log.message}
                        {log.app_version && (
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                            App: {log.app_version} • Platform: {log.platform || 'N/A'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* Recent Logs Section - migrated to database */}
        {recentLogs && recentLogs.logs && recentLogs.logs.length > 0 && !searchMode && (
          <div style={cardStyles}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ 
                  margin: '0 0 4px 0', 
                  color: '#ffffffff', 
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
                  fontFamily: 'Verdana, sans-serif' 
                }}>Recent Logs</h2>
                <div style={{ color: '#cacacaff', fontSize: '13px', fontFamily: 'Verdana, sans-serif' }}>
                  Showing {recentLogs.count} recent logs from database
                </div>
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Verdana, sans-serif' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Time</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>User</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Level</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLogs.logs.map((log, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '12px', color: '#cacacaff', fontSize: '13px' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#cacacaff', fontSize: '13px' }}>
                        {log.user_email || `User ${log.user_id}`}
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>ID: {log.user_id}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={getLevelBadgeStyle(log.level)}>
                          {log.level}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#ffffff', fontSize: '13px', maxWidth: '400px' }}>
                        {log.message}
                        {log.app_version && (
                          <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                            App: {log.app_version} • Platform: {log.platform || 'N/A'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}





        {/* No data message */}
        {!loading && recentErrors && recentErrors.count === 0 && (
          <div style={cardStyles}>
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#cacacaff',
              fontFamily: 'Verdana, sans-serif'
            }}>
              No errors found in the selected time range
            </div>
          </div>
        )}
      </div>

      {/* Popups */}
      {popup.isOpen && (
        <CalculationPopup 
          message={popup.message} 
          type={popup.type}
          onClose={() => setPopup({ isOpen: false, message: '', type: 'success' })} 
        />
      )}


      {/* Top Errors Popup */}
      {showTopErrorsPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '40px'
          }}
          onClick={() => setShowTopErrorsPopup(false)}
        >
          <div
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              backgroundColor: 'rgba(60, 20, 20, 0.95)',
              padding: '30px',
              borderRadius: '20px',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#ff6464' }}>⚠️ Top Error Messages</h2>
              <button
                onClick={() => setShowTopErrorsPopup(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(100, 100, 100, 0.8)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                Close
              </button>
            </div>
            
            {topErrors.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Verdana, sans-serif' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>Error Message</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#ffffff', fontWeight: 600, width: '100px' }}>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topErrors.map((error, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#ffffff', fontSize: '13px' }}>
                          {error.message}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {error.count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#cacacaff' }}>
                No error data available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Users Popup */}
      {showTopUsersPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '40px'
          }}
          onClick={() => setShowTopUsersPopup(false)}
        >
          <div
            style={{
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              backgroundColor: 'rgba(50, 50, 50, 0.95)',
              padding: '30px',
              borderRadius: '20px',
              border: '2px solid rgba(156, 163, 175, 0.3)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: '#9ca3af' }}>👥 Users with Most Errors</h2>
              <button
                onClick={() => setShowTopUsersPopup(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(100, 100, 100, 0.8)',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontFamily: 'Verdana, sans-serif'
                }}
              >
                Close
              </button>
            </div>
            
            {topErrorUsers.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Verdana, sans-serif' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(8px)' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ffffff', fontWeight: 600 }}>User Email</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#ffffff', fontWeight: 600, width: '100px' }}>Errors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topErrorUsers.map((user, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '12px', color: '#ffffff', fontSize: '13px' }}>
                          {user.email}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: 'rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {user.count}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#cacacaff' }}>
                No user error data available
              </div>
            )}
          </div>
        </div>
      )}

      {showLorePopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '40px'
          }}
          onClick={() => setShowLorePopup(false)}
        >
          <div
            style={{
              maxWidth: '600px',
              backgroundColor: 'rgba(88, 28, 135, 0.95)',
              padding: '30px',
              borderRadius: '20px',
              border: '2px solid rgba(168, 85, 247, 0.3)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              lineHeight: 1.6
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: '#e9d5ff' }}>Level 807 - "Blooms Creek"</h2>
            <p>
              A serene yet eerie forest realm where bioluminescent flora illuminates the eternal twilight. 
              The air is thick with spores that induce vivid hallucinations after prolonged exposure.
            </p>
            <p style={{ fontStyle: 'italic', color: '#cacacaff' }}>
              "The flowers here whisper secrets of those who came before. Do not listen too closely."
            </p>
            <button
              onClick={() => setShowLorePopup(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(100, 120, 180, 0.8)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showFlytrapPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '40px'
          }}
          onClick={() => setShowFlytrapPopup(false)}
        >
          <div
            style={{
              maxWidth: '600px',
              backgroundColor: 'rgba(40, 20, 20, 0.95)',
              padding: '30px',
              borderRadius: '20px',
              border: '2px solid rgba(150, 50, 50, 0.5)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              lineHeight: 1.6
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: '#FF6B6B' }}>Entity: Flytrap Humanoid</h2>
            <p>
              <strong>Class:</strong> Hostile
            </p>
            <p>
              A carnivorous entity resembling a grotesque fusion of human and venus flytrap. 
              Attracted to movement and heat signatures. Emits a sweet, nauseating scent to lure prey.
            </p>
            <p style={{ color: '#FFD700' }}>
              <strong>Survival Tip:</strong> Remain still if spotted. They hunt primarily by motion detection.
            </p>
            <button
              onClick={() => setShowFlytrapPopup(false)}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(180, 50, 50, 0.8)',
                color: '#ffffff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Entities Lore Popup */}
      <Lvl7232003Entities 
        isOpen={showEntitiesPopup}
        onClose={() => setShowEntitiesPopup(false)}
      />

      {/* Astral Brine Lore Popup */}
      <AstralBrineLore 
        isOpen={showAstralBrinePopup}
        onClose={() => setShowAstralBrinePopup(false)}
      />
    </div>
  );
}
