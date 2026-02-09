import { useState, useEffect, useRef, useCallback } from 'react';
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
  ButtonGroup,
} from '@mui/material';
import { Refresh, Block, CheckCircle, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/images/level heaven.jpg';
import backgroundAudio from '../assets/audio/level heaven.mp3';
import Poolrooms from '../components/AdminFeatures/Poolrooms';
import BeastOfLevelHeaven from '../components/AdminFeatures/BeastOfLevelHeaven';
import LevelHeaven from '../components/AdminFeatures/LevelHeaven';

export default function UserAnalytics() {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState([{ column: 'total_sessions', order: 'desc' }]);
  const [multiSortMode, setMultiSortMode] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [timePeriod, setTimePeriod] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const audioRef = useRef(null);
  const [showLevelHeavenPopup, setShowLevelHeavenPopup] = useState(false);
  const [showBeastOfLevelHeavenPopup, setShowBeastOfLevelHeavenPopup] = useState(false);
  const [userAnalytics, setUserAnalytics] = useState({});

  // Dialog states
  const [disableDialog, setDisableDialog] = useState({ open: false, user: null, reason: '' });
  const [enableDialog, setEnableDialog] = useState({ open: false, user: null });

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
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err);
      });
    }

    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.log('Audio play failed:', err);
        });
      }
      document.removeEventListener('click', handleFirstClick);
    };

    document.addEventListener('click', handleFirstClick);

    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, []);

  // Fetch users with analytics
  const fetchUsersAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch analytics from the backend API
      const data = await userService.getUsersAnalytics({
        page,
        pageSize,
        timePeriod
      });
      
      // Extract analytics and create a map
      const analyticsMap = {};
      const usersList = [];
      
      data.analytics.forEach(analytics => {
        analyticsMap[analytics.user_id] = analytics;
        usersList.push({
          id: analytics.user_id,
          email: analytics.email,
          name: analytics.name,
          username: analytics.username,
          is_admin: analytics.is_admin,
          is_disabled: analytics.is_disabled,
          created_at: analytics.created_at
        });
      });
      
      setUserAnalytics(analyticsMap);
      
      // Filter users based on search query
      let filteredUsers = usersList;
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredUsers = usersList.filter(user => 
          user.email?.toLowerCase().includes(searchLower) ||
          user.name?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort users with multi-column support
      filteredUsers.sort((a, b) => {
        const aAnalytics = analyticsMap[a.id] || {};
        const bAnalytics = analyticsMap[b.id] || {};
        
        // Apply sorts in priority order
        for (const { column, order } of sortConfig) {
          let comparison = 0;
          
          switch (column) {
            case 'user_id':
              comparison = (b.id || 0) - (a.id || 0);
              break;
            case 'total_sessions':
              comparison = (bAnalytics.total_sessions || 0) - (aAnalytics.total_sessions || 0);
              break;
            case 'completed_sessions':
              comparison = (bAnalytics.completed_sessions || 0) - (aAnalytics.completed_sessions || 0);
              break;
            case 'failed_sessions':
              comparison = (bAnalytics.failed_sessions || 0) - (aAnalytics.failed_sessions || 0);
              break;
            case 'active_sessions':
              comparison = (bAnalytics.active_sessions || 0) - (aAnalytics.active_sessions || 0);
              break;
            case 'average_duration':
              comparison = (bAnalytics.average_session_duration || 0) - (aAnalytics.average_session_duration || 0);
              break;
            case 'recording_time':
              comparison = (bAnalytics.total_recording_time || 0) - (aAnalytics.total_recording_time || 0);
              break;
            case 'longest_session':
              comparison = (bAnalytics.longest_session_duration || 0) - (aAnalytics.longest_session_duration || 0);
              break;
            case 'segments':
              comparison = (bAnalytics.total_recording_segments || 0) - (aAnalytics.total_recording_segments || 0);
              break;
            case 'transcribed_words':
              comparison = (bAnalytics.total_transcribed_words || 0) - (aAnalytics.total_transcribed_words || 0);
              break;
            case 'last_session':
              comparison = (aAnalytics.days_since_last_session || 999999) - (bAnalytics.days_since_last_session || 999999);
              break;
            case 'account_age':
              comparison = (bAnalytics.account_age_days || 0) - (aAnalytics.account_age_days || 0);
              break;
            case 'deleted_sessions':
              comparison = (bAnalytics.deleted_sessions || 0) - (aAnalytics.deleted_sessions || 0);
              break;
          }
          
          const result = order === 'desc' ? comparison : -comparison;
          if (result !== 0) return result;
        }
        
        return 0;
      });
      
      setUsers(filteredUsers);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load user analytics');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, timePeriod, search, sortConfig]);

  // Handle disable user
  const handleDisableUser = async () => {
    try {
      await userService.disableUser(disableDialog.user.id, disableDialog.reason);
      setSuccess(`User ${disableDialog.user.email} has been disabled`);
      setDisableDialog({ open: false, user: null, reason: '' });
      fetchUsersAnalytics();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to disable user');
    }
  };

  // Handle enable user
  const handleEnableUser = async () => {
    try {
      await userService.enableUser(enableDialog.user.id);
      setSuccess(`User ${enableDialog.user.email} has been enabled`);
      setEnableDialog({ open: false, user: null });
      fetchUsersAnalytics();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to enable user');
    }
  };

  useEffect(() => {
    fetchUsersAnalytics();
  }, [fetchUsersAnalytics]);

  const totalPages = Math.ceil(total / pageSize);

  const handleSort = (column) => {
    if (multiSortMode) {
      // Multi-column sort mode: cycle through asc -> desc -> remove
      const existingIndex = sortConfig.findIndex(s => s.column === column);
      
      if (existingIndex !== -1) {
        const currentSort = sortConfig[existingIndex];
        if (currentSort.order === 'asc') {
          // asc -> desc
          const newConfig = [...sortConfig];
          newConfig[existingIndex].order = 'desc';
          setSortConfig(newConfig);
        } else {
          // desc -> remove
          const newConfig = sortConfig.filter((_, i) => i !== existingIndex);
          setSortConfig(newConfig.length > 0 ? newConfig : [{ column: 'total_sessions', order: 'desc' }]);
        }
      } else {
        // First click: add with ascending
        if (sortConfig.length < 3) {
          setSortConfig([...sortConfig, { column, order: 'asc' }]);
        }
      }
    } else {
      // Single column sort mode: cycle through asc -> desc -> default
      const currentSort = sortConfig[0];
      
      if (currentSort.column === column) {
        if (currentSort.order === 'asc') {
          // asc -> desc
          setSortConfig([{ column, order: 'desc' }]);
        } else {
          // desc -> default
          setSortConfig([{ column: 'total_sessions', order: 'desc' }]);
        }
      } else {
        // New column: start with asc
        setSortConfig([{ column, order: 'asc' }]);
      }
    }
  };

  const renderSortIcon = (column) => {
    const sortIndex = sortConfig.findIndex(s => s.column === column);
    if (sortIndex === -1) return null;
    
    const { order } = sortConfig[sortIndex];
    const priority = sortConfig.length > 1 ? sortIndex + 1 : null;
    
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 0.5 }}>
        {order === 'desc' ? 
          <ArrowDownward sx={{ fontSize: 16 }} /> : 
          <ArrowUpward sx={{ fontSize: 16 }} />}
        {priority && (
          <Typography sx={{ fontSize: 10, ml: 0.2, fontWeight: 700 }}>{priority}</Typography>
        )}
      </Box>
    );
  };

  return (
    <>
      <style>{`
        ::-webkit-scrollbar {
          display: none;
        }
        html {
          scrollbar-width: none;
        }
        body {
          overflow-y: scroll;
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
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0
        }}></Box>

        <audio ref={audioRef} loop autoPlay>
          <source src={backgroundAudio} type="audio/mpeg" />
        </audio>

        <button 
          onClick={() => setShowLevelHeavenPopup(true)}
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
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
        >
          Level Heaven?
        </button>

        <button 
          onClick={() => setShowBeastOfLevelHeavenPopup(true)}
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
          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.6)'}
        >
          Level Heaven? Entities
        </button>

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
              }}>User Analytics</h1>
              <div style={{
                color: '#cacacaff',
                marginTop: 6,
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                fontFamily: 'Verdana, sans-serif'
              }}>View user activity and usage statistics</div>
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

              <Link to="/users">
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
                  Users
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
                User Analytics
              </button>

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
                  border: '2px solid rgba(244, 67, 54, 0.5)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ff5252',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(244, 67, 54, 0.2)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(244,67,54,0.4)';
                  e.target.style.borderColor = 'rgba(244, 67, 54, 0.8)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = 'rgba(244, 67, 54, 0.5)';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </Box>

        <Card sx={{ 
          maxWidth: '95vw', 
          margin: '0 auto', 
          padding: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          zIndex: 1,
          maxHeight: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ marginBottom: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search by ID, username, email, or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
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
                '& .MuiInputBase-input::placeholder': { color: '#cacacaff', opacity: 1 }
              }}
            />

            <FormControl sx={{ 
              minWidth: 140,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' }
              },
              '& .MuiInputLabel-root': { color: '#cacacaff', fontFamily: 'Verdana, sans-serif', fontSize: '13px' },
              '& .MuiSelect-icon': { color: '#ffffff' }
            }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                label="Time Period"
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
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="24h">24 Hours</MenuItem>
                <MenuItem value="7d">7 Days</MenuItem>
                <MenuItem value="30d">30 Days</MenuItem>
                <MenuItem value="90d">90 Days</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant={multiSortMode ? 'contained' : 'outlined'}
              onClick={() => setMultiSortMode(!multiSortMode)}
              size="small"
              sx={{
                color: multiSortMode ? '#ffffff' : '#ffffff',
                borderColor: multiSortMode ? 'rgba(76, 175, 80, 0.6)' : 'rgba(255, 255, 255, 0.2)',
                fontFamily: 'Verdana, sans-serif',
                fontSize: '11px',
                backgroundColor: multiSortMode ? 'rgba(76, 175, 80, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                padding: '5px 12px',
                minWidth: 'auto',
                '&:hover': {
                  borderColor: multiSortMode ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 255, 255, 0.4)',
                  backgroundColor: multiSortMode ? 'rgba(76, 175, 80, 0.85)' : 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {multiSortMode ? 'Multi ✓' : 'Multi'}
            </Button>

            {sortConfig.length > 1 && (
              <Box
                onClick={() => setShowSortModal(true)}
                sx={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(33, 150, 243, 0.2)',
                  borderRadius: '6px',
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.3)',
                    borderColor: 'rgba(33, 150, 243, 0.7)',
                    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                  }
                }}
              >
                <Typography
                  sx={{
                    color: '#90caf9',
                    fontSize: '12px',
                    fontFamily: 'Verdana, sans-serif',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {sortConfig.length} sorts • Click to manage
                </Typography>
              </Box>
            )}

            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchUsersAnalytics}
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                fontFamily: 'Verdana, sans-serif',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Refresh
            </Button>
          </Box>

          {sortConfig.length > 1 && (
            <Box
              onClick={() => setShowSortModal(true)}
              sx={{
                marginTop: 2,
                marginBottom: 1,
                padding: 1.5,
                backgroundColor: 'rgba(33, 150, 243, 0.15)',
                borderRadius: '8px',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.25)',
                  borderColor: 'rgba(33, 150, 243, 0.6)',
                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
                },
                display: 'none'
              }}
            >
              <Typography
                sx={{
                  color: '#90caf9',
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif',
                  textAlign: 'center',
                  fontWeight: 500
                }}
              >
                <strong>{sortConfig.length} sorts active</strong> • Click to manage
              </Typography>
            </Box>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
              <CircularProgress sx={{ color: '#ffffff' }} />
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
                      <TableCell 
                        onClick={() => handleSort('user_id')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          User ID
                          {renderSortIcon('user_id')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('total_sessions')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Total
                          {renderSortIcon('total_sessions')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('completed_sessions')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Completed
                          {renderSortIcon('completed_sessions')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('failed_sessions')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Failed
                          {renderSortIcon('failed_sessions')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('active_sessions')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Active
                          {renderSortIcon('active_sessions')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('average_duration')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Avg Dur.
                          {renderSortIcon('average_duration')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('recording_time')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Rec. Time
                          {renderSortIcon('recording_time')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('longest_session')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Longest
                          {renderSortIcon('longest_session')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('segments')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Segments
                          {renderSortIcon('segments')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('transcribed_words')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Words
                          {renderSortIcon('transcribed_words')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('last_session')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Last
                          {renderSortIcon('last_session')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('account_age')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Account Age
                          {renderSortIcon('account_age')}
                        </Box>
                      </TableCell>
                      <TableCell 
                        align="center" 
                        onClick={() => handleSort('deleted_sessions')}
                        sx={{ 
                          color: '#ffffff', 
                          fontFamily: 'Verdana, sans-serif', 
                          fontWeight: 700, 
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
                          borderBottom: '1px solid rgba(255,255,255,0.2)',
                          cursor: 'pointer',
                          userSelect: 'none',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                          Deleted
                          {renderSortIcon('deleted_sessions')}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Status</TableCell>
                      <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={14} align="center" sx={{ padding: 4, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          No users found with analytics data
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => {
                        const analytics = userAnalytics[user.id] || {};
                        return (
                          <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                            <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {user.id}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.total_sessions || 0}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.completed_sessions || 0}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.failed_sessions || 0}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.active_sessions || 0}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {(analytics.average_session_duration || 0).toFixed(1)} min
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {(analytics.total_recording_time || 0).toFixed(1)} min
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {(analytics.longest_session_duration || 0).toFixed(1)} min
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.total_recording_segments || 0}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {(analytics.total_transcribed_words || 0).toLocaleString()}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.days_since_last_session !== null && analytics.days_since_last_session !== undefined
                                ? (analytics.days_since_last_session === 0 || analytics.days_since_last_session === -1)
                                  ? 'Today'
                                  : analytics.days_since_last_session === 1
                                    ? 'Yesterday'
                                    : `${Math.max(0, analytics.days_since_last_session)}d ago`
                                : 'Never'}
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.account_age_days || 0}d
                            </TableCell>
                            <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                              {analytics.deleted_sessions || 0}
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
                                    onClick={() => setEnableDialog({ open: true, user })}
                                    title="Enable User"
                                  >
                                    <CheckCircle />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    size="small"
                                    color="warning"
                                    onClick={() => setDisableDialog({ open: true, user, reason: '' })}
                                    title="Disable User"
                                  >
                                    <Block />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

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
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(33, 150, 243, 0.6)',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.8)'
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
            <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2 }}>
              Are you sure you want to disable user <strong>{disableDialog.user?.email}</strong>?
            </Typography>
            <TextField
              label="Reason for disabling"
              value={disableDialog.reason}
              onChange={(e) => setDisableDialog({ ...disableDialog, reason: e.target.value })}
              multiline
              rows={3}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.4)' }
                },
                '& .MuiInputLabel-root': { color: '#cacacaff', fontFamily: 'Verdana, sans-serif' }
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
              sx={{
                backgroundColor: 'rgba(244, 67, 54, 0.8)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 1)' }
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

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setError(null)} sx={{ fontFamily: 'Verdana, sans-serif' }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ fontFamily: 'Verdana, sans-serif' }}>
            {success}
          </Alert>
        </Snackbar>

        {/* Sort Modal */}
        <Dialog
          open={showSortModal}
          onClose={() => setShowSortModal(false)}
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
          <DialogTitle sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Active Sorts</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minWidth: 300 }}>
              {sortConfig.map((sort, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    padding: '10px 12px',
                    backgroundColor: 'rgba(33, 150, 243, 0.15)',
                    borderRadius: '6px',
                    border: '1px solid rgba(33, 150, 243, 0.3)'
                  }}
                >
                  <Typography
                    sx={{
                      minWidth: '24px',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(33, 150, 243, 0.4)',
                      borderRadius: '50%',
                      fontWeight: 700,
                      fontSize: '12px',
                      color: '#90caf9'
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Typography sx={{ flex: 1, color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
                    {sort.column.replace(/_/g, ' ').toUpperCase()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {sort.order === 'asc' ? (
                      <ArrowUpward sx={{ fontSize: 18, color: '#90caf9' }} />
                    ) : (
                      <ArrowDownward sx={{ fontSize: 18, color: '#90caf9' }} />
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      const newConfig = sortConfig.filter((_, i) => i !== index);
                      setSortConfig(newConfig.length > 0 ? newConfig : [{ column: 'total_sessions', order: 'desc' }]);
                    }}
                    sx={{
                      color: '#ff9999',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.2)'
                      }
                    }}
                  >
                    <Block sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowSortModal(false)}
              sx={{
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Done
            </Button>
          </DialogActions>
        </Dialog>

        {showLevelHeavenPopup && (
          <LevelHeaven onClose={() => setShowLevelHeavenPopup(false)} />
        )}

        {showBeastOfLevelHeavenPopup && (
          <BeastOfLevelHeaven onClose={() => setShowBeastOfLevelHeavenPopup(false)} />
        )}
      </Box>
    </>
  );
}
