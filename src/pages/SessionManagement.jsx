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
  Typography,
  Chip,
} from '@mui/material';
import { useAdmin } from '../hooks/useAdmin';
import useAuth from '../hooks/useAuth';
import backgroundImage from '../assets/images/lvl94.png';
import backgroundAudio from '../assets/audio/King\'s Curfew.mp3';

export default function SessionManagement() {
  const { querySessions, deleteSession, getSessionMetadata } = useAdmin();
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState('');
  const audioRef = useRef(null);
  const [showClickPrompt] = useState(true);

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

  const sessions = querySessions(query);

  const handleDelete = (id) => {
    deleteSession(id);
    setConfirmMsg('Session deleted successfully.');
    setSelectedSession(null);
    setTimeout(() => setConfirmMsg(''), 2000);
  };

  const handleShowMetadata = (session) => {
    const md = getSessionMetadata(session.id);
    setSelectedSession({ ...session, metadata: md });
  };

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
          borderRadius: '10px'
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

          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/users">
              <button
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                User Management
              </button>
            </Link>

            <Link to="/">
              <button
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontFamily: 'Verdana, sans-serif',
                  fontWeight: 500,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Admin Dashboard
              </button>
            </Link>

            <button
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid rgba(239, 68, 68, 0.5)',
                background: 'rgba(239, 68, 68, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'Verdana, sans-serif',
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
        boxShadow: '0 6px 18px rgba(15,23,42,0.06)'
      }}>
        <Typography variant="h4" sx={{ marginBottom: 3, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}>
          Session Management
        </Typography>
        
        <TextField
          placeholder="Search sessions by user id or device..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          sx={{ 
            marginBottom: 3,
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

        {confirmMsg && (
          <Typography sx={{ marginBottom: 2, color: '#4caf50', fontFamily: 'Verdana, sans-serif', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>
            {confirmMsg}
          </Typography>
        )}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Session ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>User ID</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Device</TableCell>
                <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Last Active</TableCell>
                <TableCell align="center" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ padding: 4, color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    No sessions found.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map(s => (
                  <TableRow key={s.id} sx={{ '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.id}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.userId}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.device}</TableCell>
                    <TableCell sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{s.lastActive}</TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Chip 
                          label="Metadata" 
                          onClick={() => handleShowMetadata(s)} 
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(33, 150, 243, 0.8)',
                            color: '#ffffff',
                            fontFamily: 'Verdana, sans-serif',
                            backdropFilter: 'blur(8px)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }
                          }}
                        />
                        <Chip 
                          label="Delete" 
                          onClick={() => handleDelete(s.id)} 
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(244, 67, 54, 0.8)',
                            color: '#ffffff',
                            fontFamily: 'Verdana, sans-serif',
                            backdropFilter: 'blur(8px)',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(244, 67, 54, 1)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
            <Typography sx={{ fontWeight: 700, color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 1, textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>Session Metadata:</Typography>
            <Box component="pre" sx={{ margin: 0, color: '#ffffff', fontFamily: 'monospace', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
              {selectedSession.metadata}
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
              ✨ click anywhere to feel the liminality
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
