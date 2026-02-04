import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, ExpandMore, Block } from '@mui/icons-material';
import { sessionService } from '../services/sessionService';
import { useAuth } from '../hooks/useAuth';

export default function SessionDetails() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConsentDialog, setShowConsentDialog] = useState(false);

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

  const fetchSessionDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sessionService.getTrainingData(sessionId);
      setSessionData(data);
    } catch (err) {
      // Check if it's a 403 forbidden error (no consent)
      if (err.message.includes('403') || err.message.toLowerCase().includes('consent')) {
        setShowConsentDialog(true);
      } else {
        setError(err.message);
      }
      console.error('Error fetching session details:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSessionDetails();
  }, [fetchSessionDetails]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        padding: 3,
        backgroundColor: '#0f172a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        padding: 3,
        backgroundColor: '#0f172a'
      }}>
        <Card sx={{ 
          maxWidth: 800, 
          margin: '0 auto', 
          padding: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={() => navigate('/sessions')}>
            Back to Sessions
          </Button>
        </Card>
      </Box>
    );
  }

  if (!sessionData) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      padding: 3,
      backgroundColor: '#0f172a'
    }}>
      {/* Header */}
      <Box sx={{ maxWidth: 1400, margin: '0 auto', marginBottom: 3 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          marginBottom: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          padding: '20px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/sessions')}
              sx={{
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
              }}
            >
              Back
            </Button>
            <Typography variant="h4" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
              Session Details #{sessionData.id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link to="/statistics">
              <Button sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>Statistics</Button>
            </Link>
            <Link to="/users">
              <Button sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>Users</Button>
            </Link>
            <Link to="/sessions">
              <Button sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>Sessions</Button>
            </Link>
            <Link to="/">
              <Button sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>Dashboard</Button>
            </Link>
            <Button onClick={handleLogout} sx={{ color: '#ef4444', fontFamily: 'Verdana, sans-serif' }}>
              Logout
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Session Overview */}
        <Card sx={{ 
          padding: 3, 
          marginBottom: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2 }}>
            Session Overview
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Title</Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.session_title}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Status</Typography>
              <Box><Chip label={sessionData.status} size="small" sx={{ backgroundColor: 'rgba(76, 175, 80, 0.8)', color: '#ffffff' }} /></Box>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Start Time</Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.9rem' }}>{formatDateTime(sessionData.start_time)}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>End Time</Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.9rem' }}>{formatDateTime(sessionData.end_time)}</Typography>
            </Box>
          </Box>
        </Card>

        {/* User Info */}
        <Card sx={{ 
          padding: 3, 
          marginBottom: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2 }}>
            User Information
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Email</Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.user.email}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Name</Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.user.name}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Username</Typography>
              <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.user.username || 'N/A'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Training Consent</Typography>
              <Box>
                <Chip 
                  label={sessionData.user.data_usage_consent ? 'Consented' : 'Not Consented'} 
                  size="small" 
                  sx={{ 
                    backgroundColor: sessionData.user.data_usage_consent ? 'rgba(76, 175, 80, 0.8)' : 'rgba(244, 67, 54, 0.8)', 
                    color: '#ffffff' 
                  }} 
                />
              </Box>
            </Box>
          </Box>
        </Card>

        {/* Stats */}
        <Card sx={{ 
          padding: 3, 
          marginBottom: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2 }}>
            Statistics
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box sx={{ padding: 2, backgroundColor: 'rgba(33, 150, 243, 0.2)', borderRadius: '10px' }}>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Total Segments</Typography>
              <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.total_segments}</Typography>
            </Box>
            <Box sx={{ padding: 2, backgroundColor: 'rgba(76, 175, 80, 0.2)', borderRadius: '10px' }}>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Total Summaries</Typography>
              <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.total_summaries}</Typography>
            </Box>
            <Box sx={{ padding: 2, backgroundColor: 'rgba(156, 39, 176, 0.2)', borderRadius: '10px' }}>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Total Words</Typography>
              <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
                {(() => {
                  const totalWords = sessionData.recording_segments?.reduce((total, seg) => {
                    const wordCount = seg.word_count || (seg.transcript_text ? seg.transcript_text.trim().split(/\s+/).length : 0);
                    return total + wordCount;
                  }, 0) || 0;
                  return totalWords.toLocaleString();
                })()}
              </Typography>
            </Box>
            <Box sx={{ padding: 2, backgroundColor: 'rgba(255, 152, 0, 0.2)', borderRadius: '10px' }}>
              <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Total Duration</Typography>
              <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>{sessionData.session_duration_minutes?.toFixed(1) || '0'} min</Typography>
            </Box>
          </Box>
        </Card>

        {/* Recording Segments */}
        {sessionData.recording_segments && sessionData.recording_segments.length > 0 && (
          <Card sx={{ 
            padding: 3, 
            marginBottom: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2 }}>
              Recording Segments ({sessionData.recording_segments.length})
            </Typography>
            {sessionData.recording_segments.map((segment, index) => (
              <Accordion key={segment.id} sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                marginBottom: 1,
                '&:before': { display: 'none' }
              }}>
                <AccordionSummary expandIcon={<ExpandMore sx={{ color: '#ffffff' }} />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', paddingRight: 2 }}>
                    <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
                      Segment #{index + 1}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {segment.duration_seconds && (
                        <Chip 
                          label={`${segment.duration_seconds?.toFixed(1)}s`} 
                          size="small" 
                          sx={{ backgroundColor: 'rgba(33, 150, 243, 0.8)', color: '#ffffff' }} 
                        />
                      )}
                      {(segment.word_count || segment.transcript_text) && (
                        <Chip 
                          label={`${segment.word_count || (segment.transcript_text ? segment.transcript_text.trim().split(/\s+/).length : 0)} words`} 
                          size="small" 
                          sx={{ backgroundColor: 'rgba(76, 175, 80, 0.8)', color: '#ffffff' }} 
                        />
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Audio Path</Typography>
                      {segment.audio_path ? (
                        <a 
                          href={segment.audio_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            color: '#60a5fa', 
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            wordBreak: 'break-all',
                            display: 'block',
                            fontFamily: 'Verdana, sans-serif'
                          }}
                          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                        >
                          🎵 Play Audio (opens in new tab)
                        </a>
                      ) : (
                        <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.85rem' }}>
                          N/A
                        </Typography>
                      )}
                    </Box>
                    {segment.transcript_text && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Transcription</Typography>
                        <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.9rem' }}>
                          {segment.transcript_text}
                        </Typography>
                      </Box>
                    )}
                    {segment.english_translation && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Translation</Typography>
                        <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.9rem' }}>
                          {segment.english_translation}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>Processed At</Typography>
                        <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.85rem' }}>
                          {formatDateTime(segment.created_at)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>User Rating</Typography>
                        {segment.rating !== null && segment.rating !== undefined ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', fontSize: '0.85rem' }}>
                              {segment.rating}/5
                            </Typography>
                            <Box sx={{ display: 'flex' }}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} style={{ color: star <= segment.rating ? '#fbbf24' : '#4b5563', fontSize: '14px' }}>★</span>
                              ))}
                            </Box>
                          </Box>
                        ) : (
                          <Typography sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif', fontSize: '0.85rem', fontStyle: 'italic' }}>
                            Not Rated
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Card>
        )}

        {/* Final Summary */}
        {sessionData.summaries && sessionData.summaries.filter(s => s.is_final_summary).length > 0 && (
          <Card sx={{ 
            padding: 3,
            marginBottom: 3,
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(76, 175, 80, 0.5)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 }}>
              <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif' }}>
                Final Summary
              </Typography>
              <Chip 
                label="Final" 
                size="small" 
                sx={{ backgroundColor: 'rgba(76, 175, 80, 0.8)', color: '#ffffff', fontWeight: 600 }} 
              />
            </Box>
            {sessionData.summaries.filter(s => s.is_final_summary).map((summary) => (
              <Box key={summary.id}>
                <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 1, fontSize: '1rem', lineHeight: 1.6 }}>
                  {summary.summary_text}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>
                  Generated: {formatDateTime(summary.generated_at || summary.created_at)}
                </Typography>
              </Box>
            ))}
          </Card>
        )}

        {/* Intermediate Summaries */}
        {sessionData.summaries && sessionData.summaries.filter(s => !s.is_final_summary).length > 0 && (
          <Card sx={{ 
            padding: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Typography variant="h5" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 2 }}>
              Intermediate Summaries ({sessionData.summaries.filter(s => !s.is_final_summary).length})
            </Typography>
            {sessionData.summaries.filter(s => !s.is_final_summary).map((summary, index) => (
              <Box key={summary.id} sx={{ 
                marginBottom: 2, 
                padding: 2, 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '10px'
              }}>
                <Typography variant="h6" sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 1 }}>
                  Intermediate Summary #{index + 1}
                </Typography>
                <Typography sx={{ color: '#ffffff', fontFamily: 'Verdana, sans-serif', marginBottom: 1 }}>
                  {summary.summary_text}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>
                    Generated: {formatDateTime(summary.generated_at || summary.created_at)}
                  </Typography>
                  {summary.chunk_range_start !== null && summary.chunk_range_end !== null && (
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: 'Verdana, sans-serif' }}>
                      Chunks: {summary.chunk_range_start} - {summary.chunk_range_end}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Card>
        )}
      </Box>

      {/* Consent Dialog */}
      <Dialog 
        open={showConsentDialog} 
        onClose={() => {
          setShowConsentDialog(false);
          navigate('/sessions');
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '2px solid rgba(244, 67, 54, 0.5)',
            borderRadius: '16px',
            minWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#ffffff', 
          fontFamily: 'Verdana, sans-serif', 
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          paddingTop: 3
        }}>
          <Block sx={{ color: '#ef4444', fontSize: '2rem' }} />
          <span>Access Denied</span>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 2, paddingBottom: 2 }}>
          <Typography sx={{ 
            color: '#ffffff', 
            fontFamily: 'Verdana, sans-serif',
            textAlign: 'center',
            fontSize: '1rem',
            lineHeight: 1.6
          }}>
            This session cannot be accessed because the user has not consented to training data usage.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
          <Button 
            onClick={() => {
              setShowConsentDialog(false);
              navigate('/sessions');
            }}
            sx={{
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              color: '#ffffff',
              fontFamily: 'Verdana, sans-serif',
              padding: '10px 30px',
              borderRadius: '25px',
              fontWeight: 600,
              '&:hover': { 
                backgroundColor: 'rgba(239, 68, 68, 1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
              }
            }}
          >
            Back to Sessions
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
