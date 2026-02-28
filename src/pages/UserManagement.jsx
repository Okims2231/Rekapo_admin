import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Block,
  CheckCircle,
  AdminPanelSettings,
  PersonOff,
  Refresh,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/images/poolrooms1.jpg';
import backgroundAudio from '../assets/audio/daisy bell.mp3';
import Poolrooms from '../components/AdminFeatures/Poolrooms';
import PoolRoomEntities from '../components/AdminFeatures/PoolRoomEntities';

export default function UserManagement() {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [isAdminFilter, setIsAdminFilter] = useState('all');
  const [isDisabledFilter, setIsDisabledFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const audioRef = useRef(null);
  const [showPoolroomsPopup, setShowPoolroomsPopup] = useState(false);
  const [showPoolRoomEntitiesPopup, setShowPoolRoomEntitiesPopup] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [userAnalytics, setUserAnalytics] = useState({});
  const [loadingAnalytics, setLoadingAnalytics] = useState({});

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

  // Auto-play background music
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1; // Set volume to 100%
      audioRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }

    // Add click handler to play audio on first user interaction
    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      // Remove listener after first click
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, []);
  
  // Dialog states
  const [disableDialog, setDisableDialog] = useState({ open: false, user: null, reason: '' });
  const [enableDialog, setEnableDialog] = useState({ open: false, user: null });
  const [adminDialog, setAdminDialog] = useState({ open: false, user: null, isAdmin: false });

  // Dummy users data
  const dummyUsers = [
    { id: 1, username: 'admin_user', name: 'Admin User', email: 'admin@meg.backrooms', is_admin: true, is_disabled: false },
    { id: 2, username: 'john_doe', name: 'John Doe', email: 'john@meg.backrooms', is_admin: false, is_disabled: false },
    { id: 3, username: 'jane_smith', name: 'Jane Smith', email: 'jane@meg.backrooms', is_admin: false, is_disabled: false },
    { id: 4, username: 'disabled_user', name: 'Disabled User', email: 'disabled@meg.backrooms', is_admin: false, is_disabled: true },
    { id: 5, username: 'mike_johnson', name: 'Mike Johnson', email: 'mike@meg.backrooms', is_admin: false, is_disabled: false },
    { id: 6, username: 'sarah_williams', name: 'Sarah Williams', email: 'sarah@meg.backrooms', is_admin: false, is_disabled: false },
    { id: 7, username: 'alex_brown', name: 'Alex Brown', email: 'alex@meg.backrooms', is_admin: true, is_disabled: false },
    { id: 8, username: 'emily_davis', name: 'Emily Davis', email: 'emily@meg.backrooms', is_admin: false, is_disabled: false },
    { id: 9, username: 'chris_wilson', name: 'Chris Wilson', email: 'chris@meg.backrooms', is_admin: false, is_disabled: false },
    { id: 10, username: 'test_user', name: 'Test User', email: 'test@meg.backrooms', is_admin: false, is_disabled: false },
  ];

  // Fetch users
  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      let filtered = [...dummyUsers];
      
      // Apply search filter
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(u => 
          u.id.toString().includes(searchLower) ||
          u.username.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.name.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply admin filter
      if (isAdminFilter === 'true') {
        filtered = filtered.filter(u => u.is_admin === true);
      } else if (isAdminFilter === 'false') {
        filtered = filtered.filter(u => u.is_admin === false);
      }
      
      // Apply disabled filter
      if (isDisabledFilter === 'false') {
        filtered = filtered.filter(u => u.is_disabled === false);
      } else if (isDisabledFilter === 'true') {
        filtered = filtered.filter(u => u.is_disabled === true);
      }
      
      setTotal(filtered.length);
      
      // Apply pagination
      const start = (page - 1) * pageSize;
      const paginatedUsers = filtered.slice(start, start + pageSize);
      setUsers(paginatedUsers);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, isAdminFilter, isDisabledFilter]);

  // Handle disable user
  const handleDisableUser = () => {
    setUsers(users.map(u => 
      u.id === disableDialog.user.id 
        ? { ...u, is_disabled: true }
        : u
    ));
    setSuccess(`User ${disableDialog.user.email} has been disabled`);
    setDisableDialog({ open: false, user: null, reason: '' });
  };

  // Handle enable user
  const handleEnableUser = () => {
    setUsers(users.map(u => 
      u.id === enableDialog.user.id 
        ? { ...u, is_disabled: false }
        : u
    ));
    setSuccess(`User ${enableDialog.user.email} has been enabled`);
    setEnableDialog({ open: false, user: null });
  };



  // Handle admin status update
  const handleUpdateAdminStatus = () => {
    setUsers(users.map(u => 
      u.id === adminDialog.user.id 
        ? { ...u, is_admin: adminDialog.isAdmin }
        : u
    ));
    const action = adminDialog.isAdmin ? 'promoted to admin' : 'demoted from admin';
    setSuccess(`User ${adminDialog.user.email} has been ${action}`);
    setAdminDialog({ open: false, user: null, isAdmin: false });
  };

  // Handle row expansion and fetch analytics
  const handleExpandRow = (userId) => {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);

    // Fetch analytics if not already loaded
    if (!userAnalytics[userId]) {
      setLoadingAnalytics(prev => ({ ...prev, [userId]: true }));
      
      setTimeout(() => {
        // Dummy analytics data
        const dummyAnalytics = {
          1: { total_sessions: 127, completed_sessions: 118, failed_sessions: 4, active_sessions: 5, average_session_duration: 38.5, total_recording_time: 4879.5, longest_session_duration: 156.3, total_recording_segments: 1289, total_transcribed_words: 289456, days_since_last_session: 0, account_age_days: 512, deleted_sessions: 12 },
          2: { total_sessions: 45, completed_sessions: 42, failed_sessions: 2, active_sessions: 1, average_session_duration: 32.5, total_recording_time: 1462.5, longest_session_duration: 89.2, total_recording_segments: 456, total_transcribed_words: 98765, days_since_last_session: 2, account_age_days: 256, deleted_sessions: 3 },
          3: { total_sessions: 67, completed_sessions: 64, failed_sessions: 2, active_sessions: 1, average_session_duration: 35.8, total_recording_time: 2398.6, longest_session_duration: 124.5, total_recording_segments: 712, total_transcribed_words: 156234, days_since_last_session: 1, account_age_days: 198, deleted_sessions: 5 },
          4: { total_sessions: 12, completed_sessions: 8, failed_sessions: 3, active_sessions: 0, average_session_duration: 25.3, total_recording_time: 303.6, longest_session_duration: 67.8, total_recording_segments: 98, total_transcribed_words: 34567, days_since_last_session: 45, account_age_days: 128, deleted_sessions: 2 },
          5: { total_sessions: 89, completed_sessions: 85, failed_sessions: 3, active_sessions: 1, average_session_duration: 37.2, total_recording_time: 3309.8, longest_session_duration: 142.1, total_recording_segments: 921, total_transcribed_words: 212543, days_since_last_session: 3, account_age_days: 384, deleted_sessions: 7 },
          6: { total_sessions: 52, completed_sessions: 49, failed_sessions: 2, active_sessions: 1, average_session_duration: 31.4, total_recording_time: 1632.8, longest_session_duration: 98.6, total_recording_segments: 534, total_transcribed_words: 121876, days_since_last_session: 5, account_age_days: 276, deleted_sessions: 4 },
          7: { total_sessions: 156, completed_sessions: 151, failed_sessions: 3, active_sessions: 2, average_session_duration: 39.1, total_recording_time: 6099.6, longest_session_duration: 167.8, total_recording_segments: 1567, total_transcribed_words: 345678, days_since_last_session: 0, account_age_days: 498, deleted_sessions: 15 },
          8: { total_sessions: 38, completed_sessions: 35, failed_sessions: 2, active_sessions: 1, average_session_duration: 29.7, total_recording_time: 1128.6, longest_session_duration: 76.4, total_recording_segments: 378, total_transcribed_words: 87654, days_since_last_session: 6, account_age_days: 167, deleted_sessions: 2 },
          9: { total_sessions: 73, completed_sessions: 70, failed_sessions: 2, active_sessions: 1, average_session_duration: 36.3, total_recording_time: 2649.9, longest_session_duration: 131.2, total_recording_segments: 756, total_transcribed_words: 178932, days_since_last_session: 4, account_age_days: 312, deleted_sessions: 6 },
          10: { total_sessions: 29, completed_sessions: 26, failed_sessions: 2, active_sessions: 1, average_session_duration: 28.1, total_recording_time: 814.9, longest_session_duration: 84.3, total_recording_segments: 287, total_transcribed_words: 65432, days_since_last_session: 7, account_age_days: 143, deleted_sessions: 3 },
        };
        
        setUserAnalytics(prev => ({ ...prev, [userId]: dummyAnalytics[userId] }));
        setLoadingAnalytics(prev => ({ ...prev, [userId]: false }));
      }, 300);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

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
      <Box sx={{ 
        minHeight: '100vh', 
        padding: 3,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}>
      {/* Dark overlay for better readability */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 0
      }}></Box>

      {/* Background Audio */}
      <audio ref={audioRef} loop autoPlay>
        <source src={backgroundAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Poolrooms Button - Fixed Upper Right */}
      <button 
        onClick={() => setShowPoolroomsPopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          background: 'rgba(0, 0, 0, 0.6)', 
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
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)';
        }}
      >
        Poolrooms
      </button>

      {/* Pool Room Entities Button - Fixed Upper Left */}
      <button 
        onClick={() => setShowPoolRoomEntitiesPopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          background: 'rgba(0, 0, 0, 0.6)', 
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
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)';
        }}
      >
        Pool Room Entities
      </button>

      {/* Header with Navigation */}
      <Box sx={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, marginBottom: 3 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '20px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              color: '#ffffffff',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              fontFamily: 'Verdana, sans-serif'
            }}>User Management</h1>
            <div style={{
              color: '#cacacaff',
              marginTop: 6,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: 'Verdana, sans-serif'
            }}>Manage users and permissions</div>
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <Link to="/statistics">
              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                Statistics
              </button>
            </Link>

            <button
              style={{
                padding: '8px 14px',
                borderRadius: '25px',
                border: '2px solid rgba(13, 71, 161, 0.6)',
                background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.9), rgba(21, 101, 192, 0.9))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'default',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(13, 71, 161, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Users
            </button>

            <Link to="/user-analytics">
              <button
                style={{
                  padding: '8px 14px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.6)';
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
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.6)';
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
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.6)';
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
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.6)';
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
      </Box>

      <Card sx={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: 3,
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        maxHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <Typography variant="h4" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>User Management</Typography>
          <Button 
            startIcon={<Refresh />} 
            onClick={fetchUsers} 
            disabled={loading}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexWrap: 'wrap' }}>
          <TextField
            label="Search"
            placeholder="Search by ID, username, email, or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              flexGrow: 1, 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.6)' }
              },
              '& .MuiInputLabel-root': { color: '#cacacaff', fontFamily: 'Verdana, sans-serif' },
              '& .MuiInputBase-input::placeholder': { color: '#999', opacity: 1 }
            }}
          />
          <FormControl sx={{ 
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' }
            },
            '& .MuiInputLabel-root': { color: '#cacacaff', fontFamily: 'Verdana, sans-serif' },
            '& .MuiSelect-icon': { color: '#ffffff' }
          }}>
            <InputLabel>Admin Status</InputLabel>
            <Select 
              value={isAdminFilter} 
              onChange={(e) => setIsAdminFilter(e.target.value)} 
              label="Admin Status"
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '& .MuiMenuItem-root': {
                      color: '#ffffff',
                      fontFamily: 'Verdana, sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.25)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="true">Admin</MenuItem>
              <MenuItem value="false">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ 
            minWidth: 150,
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' }
            },
            '& .MuiInputLabel-root': { color: '#cacacaff', fontFamily: 'Verdana, sans-serif' },
            '& .MuiSelect-icon': { color: '#ffffff' }
          }}>
            <InputLabel>Account Status</InputLabel>
            <Select 
              value={isDisabledFilter} 
              onChange={(e) => setIsDisabledFilter(e.target.value)} 
              label="Account Status"
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '& .MuiMenuItem-root': {
                      color: '#ffffff',
                      fontFamily: 'Verdana, sans-serif',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.25)'
                        }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="false">Active</MenuItem>
              <MenuItem value="true">Disabled</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer sx={{
              flex: 1,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px'
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)'
                }
              }
            }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>ID</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Username</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Name</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Email</TableCell>
                    <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Users</TableCell>
                    <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Status</TableCell>
                    <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ padding: 4, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <>
                        <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }, cursor: 'pointer' }}>
                          <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleExpandRow(user.id)}
                                sx={{ color: '#ffffff' }}
                              >
                                {expandedUserId === user.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                              </IconButton>
                              {user.id}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {user.username || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {user.name || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{user.email}</TableCell>
                          <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {user.is_admin ? (
                              <Chip label="Admin" size="small" sx={{ backgroundColor: 'rgba(33, 150, 243, 0.8)', color: '#ffffff', fontFamily: 'Verdana, sans-serif', backdropFilter: 'blur(8px)' }} />
                            ) : (
                              <Chip label="User" size="small" sx={{ backgroundColor: 'rgba(158, 158, 158, 0.6)', color: '#ffffff', fontFamily: 'Verdana, sans-serif', backdropFilter: 'blur(8px)' }} />
                            )}
                          </TableCell>
                          <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {user.is_disabled ? (
                              <Chip label="Disabled" size="small" sx={{ backgroundColor: 'rgba(244, 67, 54, 0.8)', color: '#ffffff', fontFamily: 'Verdana, sans-serif', backdropFilter: 'blur(8px)' }} />
                            ) : (
                              <Chip label="Active" size="small" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.8)', color: '#ffffff', fontFamily: 'Verdana, sans-serif', backdropFilter: 'blur(8px)' }} />
                            )}
                          </TableCell>
                          <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              {user.is_disabled ? (
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => { e.stopPropagation(); setEnableDialog({ open: true, user }); }}
                                  title="Enable User"
                                >
                                  <CheckCircle />
                                </IconButton>
                              ) : (
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={(e) => { e.stopPropagation(); setDisableDialog({ open: true, user, reason: '' }); }}
                                  title="Disable User"
                                >
                                  <Block />
                                </IconButton>
                              )}
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => { e.stopPropagation(); setAdminDialog({ open: true, user, isAdmin: !user.is_admin }); }}
                                title={user.is_admin ? 'Demote from Admin' : 'Promote to Admin'}
                              >
                                <AdminPanelSettings />
                              </IconButton>

                            </Box>
                          </TableCell>
                        </TableRow>
                        {expandedUserId === user.id && (
                          <TableRow>
                            <TableCell colSpan={7} sx={{ padding: 0, borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                              <Box sx={{ 
                                padding: 3, 
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(4px)',
                                WebkitBackdropFilter: 'blur(4px)'
                              }}>
                                {loadingAnalytics[user.id] ? (
                                  <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
                                    <CircularProgress size={30} sx={{ color: '#ffffff' }} />
                                  </Box>
                                ) : userAnalytics[user.id] ? (
                                  <Box>
                                    <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                      User Analytics
                                    </Typography>
                                    <Box sx={{ 
                                      display: 'grid', 
                                      gridTemplateColumns: {
                                        xs: 'repeat(2, 1fr)',
                                        sm: 'repeat(3, 1fr)',
                                        md: 'repeat(4, 1fr)',
                                        lg: 'repeat(4, 1fr)',
                                      },
                                      gap: 2 
                                    }}>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(33, 150, 243, 0.2)', borderRadius: '8px', border: '1px solid rgba(33, 150, 243, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Total Sessions</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].total_sessions}</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(76, 175, 80, 0.2)', borderRadius: '8px', border: '1px solid rgba(76, 175, 80, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Completed Sessions</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].completed_sessions}</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(244, 67, 54, 0.2)', borderRadius: '8px', border: '1px solid rgba(244, 67, 54, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Failed Sessions</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].failed_sessions}</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(255, 152, 0, 0.2)', borderRadius: '8px', border: '1px solid rgba(255, 152, 0, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Active Sessions</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].active_sessions}</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(156, 39, 176, 0.2)', borderRadius: '8px', border: '1px solid rgba(156, 39, 176, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Avg Session Duration</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].average_session_duration?.toFixed(1) || 0} min</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(0, 188, 212, 0.2)', borderRadius: '8px', border: '1px solid rgba(0, 188, 212, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Total Recording Time</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].total_recording_time?.toFixed(1) || 0} min</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(255, 193, 7, 0.2)', borderRadius: '8px', border: '1px solid rgba(255, 193, 7, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Longest Session</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].longest_session_duration?.toFixed(1) || 0} min</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(103, 58, 183, 0.2)', borderRadius: '8px', border: '1px solid rgba(103, 58, 183, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Recording Segments</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].total_recording_segments}</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(233, 30, 99, 0.2)', borderRadius: '8px', border: '1px solid rgba(233, 30, 99, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Transcribed Words</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].total_transcribed_words?.toLocaleString()}</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(121, 134, 203, 0.2)', borderRadius: '8px', border: '1px solid rgba(121, 134, 203, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Last Session</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>
                                          {userAnalytics[user.id].days_since_last_session !== null 
                                            ? (userAnalytics[user.id].days_since_last_session === 0 || userAnalytics[user.id].days_since_last_session === -1)
                                              ? 'Today'
                                              : userAnalytics[user.id].days_since_last_session === 1
                                                ? 'Yesterday'
                                                : `${Math.max(0, userAnalytics[user.id].days_since_last_session)} days ago`
                                            : 'Never'}
                                        </Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(96, 125, 139, 0.2)', borderRadius: '8px', border: '1px solid rgba(96, 125, 139, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Account Age</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].account_age_days} days</Typography>
                                      </Box>
                                      <Box sx={{ padding: 1.5, backgroundColor: 'rgba(255, 87, 34, 0.2)', borderRadius: '8px', border: '1px solid rgba(255, 87, 34, 0.4)' }}>
                                        <Typography variant="caption" sx={{ color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '0.7rem' }}>Deleted Sessions</Typography>
                                        <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 600, fontSize: '1.25rem' }}>{userAnalytics[user.id].deleted_sessions}</Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>Failed to load analytics</Typography>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#ffffff',
                      fontFamily: 'Verdana, sans-serif',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(33, 150, 243, 0.8)',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 1)'
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Card>

      {/* Disable User Dialog */}
      <Dialog 
        open={disableDialog.open} 
        onClose={() => setDisableDialog({ open: false, user: null, reason: '' })}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Disable User</DialogTitle>
        <DialogContent>
          <Typography sx={{ marginBottom: 2, color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
            Are you sure you want to disable <strong>{disableDialog.user?.email}</strong>?
          </Typography>
          <TextField
            autoFocus
            label="Reason"
            fullWidth
            multiline
            rows={3}
            value={disableDialog.reason}
            onChange={(e) => setDisableDialog({ ...disableDialog, reason: e.target.value })}
            placeholder="Enter reason for disabling this user..."
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.7)' }
              },
              '& .MuiInputLabel-root': { color: '#cacacaff', fontFamily: 'Verdana, sans-serif' },
              '& .MuiInputBase-input::placeholder': { color: '#999', opacity: 1 }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDisableDialog({ open: false, user: null, reason: '' })}
            sx={{
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDisableUser} 
            disabled={!disableDialog.reason.trim()}
            sx={{
              backgroundColor: 'rgba(255, 152, 0, 0.8)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(255, 152, 0, 1)' },
              '&.Mui-disabled': { backgroundColor: 'rgba(255, 152, 0, 0.3)', color: 'rgba(255, 255, 255, 0.3)' }
            }}
          >
            Disable
          </Button>
        </DialogActions>
      </Dialog>



      {/* Enable User Dialog */}
      <Dialog 
        open={enableDialog.open} 
        onClose={() => setEnableDialog({ open: false, user: null })}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Enable User</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
            Are you sure you want to enable user <strong>{enableDialog.user?.email}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setEnableDialog({ open: false, user: null })}
            sx={{
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEnableUser}
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.8)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(76, 175, 80, 1)' }
            }}
          >
            Enable
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Status Dialog */}
      <Dialog 
        open={adminDialog.open} 
        onClose={() => setAdminDialog({ open: false, user: null, isAdmin: false })}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{adminDialog.isAdmin ? 'Promote to Admin' : 'Demote from Admin'}</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
            Are you sure you want to {adminDialog.isAdmin ? 'promote' : 'demote'}{' '}
            <strong>{adminDialog.user?.email}</strong> {adminDialog.isAdmin ? 'to admin' : 'from admin'}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setAdminDialog({ open: false, user: null, isAdmin: false })}
            sx={{
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateAdminStatus}
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.8)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(33, 150, 243, 1)' }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success">
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      {/* Click Prompt at bottom */}
      {/* Poolrooms Popup */}
      <Poolrooms
        isOpen={showPoolroomsPopup}
        onClose={() => setShowPoolroomsPopup(false)}
      />

      {/* Pool Room Entities Popup */}
      <PoolRoomEntities
        isOpen={showPoolRoomEntitiesPopup}
        onClose={() => setShowPoolRoomEntitiesPopup(false)}
      />
      </Box>
    </>
  );
}
