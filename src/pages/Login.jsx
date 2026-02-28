import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Typography } from '@mui/material';
import backgroundImage from '../assets/images/lvl0.jpg';
import backgroundAudio from '../assets/audio/Fallen Down - Toby Fox.mp3';
import TheBackrooms from '../components/AdminFeatures/TheBackrooms';
import MEG from '../components/AdminFeatures/MEG';

export default function Login() {
  const navigate = useNavigate();
  const audioRef = useRef(null);

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

  const handleLogin = () => {
    // Simulate successful login with dummy data
    localStorage.setItem('adminToken', 'dummy-admin-token-12345');
    localStorage.setItem('adminUser', JSON.stringify({
      id: 1,
      name: 'Admin User',
      email: 'admin@meg.backrooms',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    }));
    
    // Instant redirect to main admin panel
    window.location.href = '/';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better readability
        },
      }}
    >
      {/* The Backrooms Component */}
      <TheBackrooms />

      {/* M.E.G Component */}
      <MEG />

      {/* Background Audio */}
      <audio 
        ref={audioRef} 
        loop 
        autoPlay 
        onLoadedMetadata={(e) => {
          e.target.volume = 0.3;
        }}
      >
        <source src={backgroundAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Card sx={{ 
        padding: 4, 
        maxWidth: 400, 
        width: '100%', 
        position: 'relative', 
        zIndex: 1,
        boxShadow: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        <Typography variant="h4" component="h1" sx={{ marginBottom: 2, textAlign: 'center', color: '#ffffffff' }}>
          M.E.G Admin
        </Typography>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleLogin}
          sx={{
            backgroundColor: '#272b31ff',
            '&:hover': {
              backgroundColor: '#111827',
            },
          }}
        >
          Enter Admin Panel
        </Button>

        <Typography
          variant="body2"
          sx={{ marginTop: 2, textAlign: 'center', color: '#ffffffff', fontFamily: 'Verdana, sans-serif' }}
        >
          Demo Mode - No authentication required.
        </Typography>
      </Card>
    </Box>
  );
}
