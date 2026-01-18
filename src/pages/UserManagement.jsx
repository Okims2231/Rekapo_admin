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
  Delete,
  AdminPanelSettings,
  PersonOff,
  Refresh,
} from '@mui/icons-material';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import backgroundImage from '../assets/images/poolrooms1.jpg';
import backgroundAudio from '../assets/audio/daisy bell.mp3';
import Poolrooms from '../components/AdminFeatures/Poolrooms';

export default function UserManagement() {
  const navigate = useNavigate();
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
  const [showClickPrompt] = useState(true);
  const [showPoolroomsPopup, setShowPoolroomsPopup] = useState(false);

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
      audioRef.current.volume = 0.3; // Set volume to 30%
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
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [adminDialog, setAdminDialog] = useState({ open: false, user: null, isAdmin: false });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        pageSize,
        search: search.trim(),
      };
      
      if (isAdminFilter !== 'all') {
        params.isAdmin = isAdminFilter === 'true';
      }
      
      if (isDisabledFilter !== 'all') {
        params.isDisabled = isDisabledFilter === 'true';
      }
      
      const data = await userService.getUsers(params);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, search, isAdminFilter, isDisabledFilter]);

  // Handle disable user
  const handleDisableUser = async () => {
    try {
      await userService.disableUser(disableDialog.user.id, disableDialog.reason);
      setSuccess(`User ${disableDialog.user.email} has been disabled`);
      setDisableDialog({ open: false, user: null, reason: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to disable user');
    }
  };

  // Handle enable user
  const handleEnableUser = async (user) => {
    try {
      await userService.enableUser(user.id);
      setSuccess(`User ${user.email} has been enabled`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to enable user');
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(deleteDialog.user.id);
      setSuccess(`User ${deleteDialog.user.email} has been deleted`);
      setDeleteDialog({ open: false, user: null });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete user');
    }
  };

  // Handle admin status update
  const handleUpdateAdminStatus = async () => {
    try {
      await userService.updateAdminStatus(adminDialog.user.id, adminDialog.isAdmin);
      const action = adminDialog.isAdmin ? 'promoted to admin' : 'demoted from admin';
      setSuccess(`User ${adminDialog.user.email} has been ${action}`);
      setAdminDialog({ open: false, user: null, isAdmin: false });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update admin status');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
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

      {/* Poolrooms Button - Fixed Upper Left */}
      <button 
        onClick={() => setShowPoolroomsPopup(true)}
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
        Poolrooms
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

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/statistics">
              <button
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
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
                padding: '10px 20px',
                borderRadius: '25px',
                border: '2px solid rgba(13, 71, 161, 0.6)',
                background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.9), rgba(21, 101, 192, 0.9))',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'default',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '14px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(13, 71, 161, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Users
            </button>

            <Link to="/sessions">
              <button
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
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

            <Link to="/">
              <button
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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
            placeholder="Search by name or email..."
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
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
                      <TableCell colSpan={5} align="center" sx={{ padding: 4, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                        <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{user.name || 'N/A'}</TableCell>
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
                                onClick={() => handleEnableUser(user)}
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
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setAdminDialog({ open: true, user, isAdmin: !user.is_admin })}
                              title={user.is_admin ? 'Demote from Admin' : 'Promote to Admin'}
                            >
                              <AdminPanelSettings />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ open: true, user })}
                              title="Delete User"
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
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

      {/* Delete User Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, user: null })}
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
        <DialogTitle sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Delete User</DialogTitle>
        <DialogContent>
          <Alert 
            severity="warning" 
            sx={{ 
              marginBottom: 2,
              backgroundColor: 'rgba(255, 152, 0, 0.2)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              border: '1px solid rgba(255, 152, 0, 0.5)',
              '& .MuiAlert-icon': { color: '#ff9800' }
            }}
          >
            This action cannot be undone!
          </Alert>
          <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
            Are you sure you want to permanently delete <strong>{deleteDialog.user?.email}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialog({ open: false, user: null })}
            sx={{
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteUser}
            sx={{
              backgroundColor: 'rgba(244, 67, 54, 0.8)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              '&:hover': { backgroundColor: 'rgba(244, 67, 54, 1)' }
            }}
          >
            Delete
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
      {showClickPrompt && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: '30px 0',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box
            sx={{
              padding: '10px 20px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              animation: 'fadeInPulse 2s ease-in-out infinite',
              '@keyframes fadeInPulse': {
                '0%, 100%': { opacity: 0.6 },
                '50%': { opacity: 0.9 },
              },
            }}
          >
            <Typography
              sx={{
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                letterSpacing: '0.3px',
              }}
            >
            click anywhere to feel the liminality
            </Typography>
          </Box>
        </Box>
      )}

      {/* Poolrooms Popup */}
      <Poolrooms
        isOpen={showPoolroomsPopup}
        onClose={() => setShowPoolroomsPopup(false)}
      />
    </Box>
  );
}
