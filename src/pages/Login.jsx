import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Card, CircularProgress, Typography, Alert } from '@mui/material';
import useAuth from '../hooks/useAuth';
import authService from '../services/authService';
import backgroundImage from '../assets/images/lvl0.jpg';
import backgroundAudio from '../assets/audio/Fallen Down - Toby Fox.mp3';
import TheBackrooms from '../components/AdminFeatures/TheBackrooms';
import MEG from '../components/AdminFeatures/MEG';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const [showClickPrompt] = useState(true);

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

  // Check for error in URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const { authorization_url } = await authService.initiateLogin();
      window.location.href = authorization_url;
    } catch (err) {
      setError(err?.message || 'Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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

      {/* Click Prompt */}
      {showClickPrompt && (
        <Box
          sx={{
            position: 'fixed',
            top: 30,
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
      )}

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

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{
            backgroundColor: '#272b31ff',
            '&:hover': {
              backgroundColor: '#111827',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in with Google'}
        </Button>

        <Typography
          variant="body2"
          sx={{ marginTop: 2, textAlign: 'center', color: '#ffffffff', fontFamily: 'Verdana, sans-serif' }}
        >
          Only authorized M.E.G personel can access this admin panel.
        </Typography>
      </Card>
    </Box>
  );
}
