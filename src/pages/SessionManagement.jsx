import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { sessionService } from '../services/sessionService';
import useAuth from '../hooks/useAuth';
import backgroundImage from '../assets/images/lvl94.png';
import backgroundAudio from '../assets/audio/King\'s Curfew.mp3';
import Level94 from '../components/AdminFeatures/Level94';
import AnimatedEntities from '../components/AdminFeatures/AnimatedEntities';

export default function SessionManagement() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [trainingConsentFilter, setTrainingConsentFilter] = useState('');
  const [deletedFilter, setDeletedFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalSessions, setTotalSessions] = useState(0);
  const [selectedSession, setSelectedSession] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState('');
  const audioRef = useRef(null);
  const [showLevel94Popup, setShowLevel94Popup] = useState(false);
  const [showAnimatedEntitiesPopup, setShowAnimatedEntitiesPopup] = useState(false);

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
  const pageSize = 10;

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

  // Fetch sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sessionService.getSessions(
        page,
        pageSize,
        query || null,
        statusFilter || null,
        trainingConsentFilter || null,
        deletedFilter || null
      );
      // Handle different response formats
      const sessionsList = Array.isArray(data) ? data : (data.sessions || data.data || []);
      const total = data.total || (Array.isArray(data) ? data.length : sessionsList.length);
      setSessions(sessionsList);
      setTotalSessions(total);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [page, pageSize, query, statusFilter, trainingConsentFilter, deletedFilter]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleTrainingConsentChange = (e) => {
    setTrainingConsentFilter(e.target.value);
    setPage(1);
  };

  const handleDeletedFilterChange = (e) => {
    setDeletedFilter(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionService.deleteSession(id, 'Deleted by admin');
        setConfirmMsg('Session deleted successfully.');
        fetchSessions();
        setSelectedSession(null);
        setTimeout(() => setConfirmMsg(''), 2000);
      } catch (err) {
        setConfirmMsg(`Error: ${err.message}`);
        setTimeout(() => setConfirmMsg(''), 3000);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recording':
        return 'rgba(76, 175, 80, 0.8)';
      case 'completed':
        return 'rgba(33, 150, 243, 0.8)';
      case 'failed':
        return 'rgba(244, 67, 54, 0.8)';
      default:
        return 'rgba(158, 158, 158, 0.8)';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

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

      {/* Level 94 Button - Fixed Upper Right */}
      <button 
        onClick={() => setShowLevel94Popup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '2px solid rgba(255, 255, 255, 0.2)', 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
          color: '#ffffff',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
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
        Level 94
      </button>

      {/* Animated Entities Button - Fixed Upper Left */}
      <button 
        onClick={() => setShowAnimatedEntitiesPopup(true)}
        style={{ 
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          padding: '10px 20px', 
          borderRadius: '20px', 
          border: '2px solid rgba(255, 255, 255, 0.2)', 
          background: 'rgba(255, 255, 255, 0.1)', 
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          cursor: 'pointer',
          color: '#ffffff',
          fontFamily: 'Verdana, sans-serif',
          fontWeight: 500,
          fontSize: '14px',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
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
        Entities
      </button>

      {/* Header with Navigation */}
      <Box sx={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, marginBottom: 3 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '30px'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              color: '#ffffffff',
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              fontFamily: 'Verdana, sans-serif'
            }}>Session Management</h1>
            <div style={{
              color: '#cacacaff',
              marginTop: 6,
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
              fontFamily: 'Verdana, sans-serif'
            }}>Monitor and manage active sessions</div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/statistics">
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
                Statistics
              </button>
            </Link>

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
                Users
              </button>
            </Link>

            <Link to="/user-analytics">
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
                User Analytics
              </button>
            </Link>

            <button
              style={{
                padding: '10px 20px',
                borderRadius: '25px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'default',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              Sessions
            </button>

            <Link to="/">
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
                Dashboard
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
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
        maxHeight: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '30px'
      }}>
        <Typography variant="h4" sx={{ marginBottom: 3, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
          Session Management
        </Typography>

        {error && (
          <Typography sx={{ marginBottom: 2, color: '#f44336', fontFamily: 'Verdana, sans-serif', fontWeight: 500 }}>
            Error: {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search by user ID or session title..."
            value={query}
            onChange={handleSearch}
            sx={{ 
              flex: 1,
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused fieldset': { borderColor: 'rgba(255, 255, 255, 0.7)' }
              },
              '& .MuiInputBase-input::placeholder': { color: '#999', opacity: 1 }
            }}
          />

          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel sx={{ color: '#ffffff' }}>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              label="Status"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiSvgIcon-root': { color: '#ffffff' }
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="recording">Recording</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel sx={{ color: '#ffffff' }}>Training Consent</InputLabel>
            <Select
              value={trainingConsentFilter}
              onChange={handleTrainingConsentChange}
              label="Training Consent"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiSvgIcon-root': { color: '#ffffff' }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Consented</MenuItem>
              <MenuItem value="false">Not Consented</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: '150px' }}>
            <InputLabel sx={{ color: '#ffffff' }}>Deleted Status</InputLabel>
            <Select
              value={deletedFilter}
              onChange={handleDeletedFilterChange}
              label="Deleted Status"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.7)' },
                '& .MuiSvgIcon-root': { color: '#ffffff' }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Deleted</MenuItem>
              <MenuItem value="false">Not Deleted</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {confirmMsg && (
          <Typography sx={{ marginBottom: 2, color: '#4caf50', fontFamily: 'Verdana, sans-serif', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            {confirmMsg}
          </Typography>
        )}

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
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)'
          }
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Session ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>User ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Title</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Start Time</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>End Time</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Status</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Training Consent</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ padding: 4, color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
                    Loading sessions...
                  </TableCell>
                </TableRow>
              ) : sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ padding: 4, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    No sessions found.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map(s => (
                  <TableRow key={s.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.id}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.user_id}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.session_title}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>{formatDateTime(s.start_time)}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem' }}>{formatDateTime(s.end_time)}</TableCell>
                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <Chip 
                        label={s.status} 
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(s.status),
                          color: '#ffffff',
                          fontFamily: 'Verdana, sans-serif',
                          fontWeight: 600,
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <Chip 
                        label={s.user?.data_usage_consent ? 'Consented' : 'Not Consented'} 
                        size="small"
                        sx={{
                          backgroundColor: s.user?.data_usage_consent ? 'rgba(76, 175, 80, 0.8)' : 'rgba(158, 158, 158, 0.8)',
                          color: '#ffffff',
                          fontFamily: 'Verdana, sans-serif',
                          fontWeight: 600,
                          backdropFilter: 'blur(8px)',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button 
                          onClick={() => navigate(`/sessions/${s.id}`)} 
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '2px solid rgba(100, 200, 255, 0.8)',
                            background: 'rgba(33, 150, 243, 0.7)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            cursor: 'pointer',
                            color: '#ffffff',
                            fontFamily: 'Verdana, sans-serif',
                            fontWeight: 700,
                            fontSize: '13px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                            boxShadow: '0 0 15px rgba(33, 150, 243, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            minWidth: '80px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(33, 150, 243, 0.9)';
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 0 25px rgba(33, 150, 243, 0.9), inset 0 1px 2px rgba(255,255,255,0.3)';
                            e.target.style.borderColor = 'rgba(100, 200, 255, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(33, 150, 243, 0.7)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 0 15px rgba(33, 150, 243, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)';
                            e.target.style.borderColor = 'rgba(100, 200, 255, 0.8)';
                          }}
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)} 
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '2px solid rgba(255, 120, 100, 0.8)',
                            background: 'rgba(244, 67, 54, 0.7)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            cursor: 'pointer',
                            color: '#ffffff',
                            fontFamily: 'Verdana, sans-serif',
                            fontWeight: 700,
                            fontSize: '13px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                            boxShadow: '0 0 15px rgba(244, 67, 54, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)',
                            transition: 'all 0.3s ease',
                            minWidth: '80px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(244, 67, 54, 0.9)';
                            e.target.style.transform = 'translateY(-3px)';
                            e.target.style.boxShadow = '0 0 25px rgba(244, 67, 54, 0.9), inset 0 1px 2px rgba(255,255,255,0.3)';
                            e.target.style.borderColor = 'rgba(255, 120, 100, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(244, 67, 54, 0.7)';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 0 15px rgba(244, 67, 54, 0.6), inset 0 1px 2px rgba(255,255,255,0.2)';
                            e.target.style.borderColor = 'rgba(255, 120, 100, 0.8)';
                          }}
                        >
                          Delete
                        </button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {sessions.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 3 }}>
            <Button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              sx={{
                backgroundColor: page === 1 ? 'rgba(158, 158, 158, 0.5)' : 'rgba(76, 175, 80, 0.8)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                '&:hover': {
                  backgroundColor: page === 1 ? 'rgba(158, 158, 158, 0.5)' : 'rgba(76, 175, 80, 1)',
                }
              }}
            >
              Previous
            </Button>
            <Typography sx={{ padding: '8px 16px', fontWeight: 'bold', color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
              Page {page} of {Math.ceil(totalSessions / pageSize)}
            </Typography>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= totalSessions}
              sx={{
                backgroundColor: page * pageSize >= totalSessions ? 'rgba(158, 158, 158, 0.5)' : 'rgba(76, 175, 80, 0.8)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                cursor: page * pageSize >= totalSessions ? 'not-allowed' : 'pointer',
                '&:hover': {
                  backgroundColor: page * pageSize >= totalSessions ? 'rgba(158, 158, 158, 0.5)' : 'rgba(76, 175, 80, 1)',
                }
              }}
            >
              Next
            </Button>
          </Box>
        )}

        {selectedSession && (
          <Box sx={{ 
            marginTop: 3, 
            padding: 2, 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography sx={{ fontWeight: 700, color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 1, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>Session Details:</Typography>
            <Box component="pre" sx={{ margin: 0, color: '#ffffff', fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre-wrap', overflow: 'auto' }}>
              {JSON.stringify(selectedSession, null, 2)}
            </Box>
            <Button 
              onClick={() => setSelectedSession(null)} 
              sx={{ 
                marginTop: 2,
                backgroundColor: 'rgba(158, 158, 158, 0.8)',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(158, 158, 158, 1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              Close
            </Button>
          </Box>
        )}
      </Card>

      {/* Level 94 Popup */}
      <Level94
        isOpen={showLevel94Popup}
        onClose={() => setShowLevel94Popup(false)}
      />

      {/* Animated Entities Popup */}
      <AnimatedEntities
        isOpen={showAnimatedEntitiesPopup}
        onClose={() => setShowAnimatedEntitiesPopup(false)}
      />
      </Box>
    </>
  );
}
