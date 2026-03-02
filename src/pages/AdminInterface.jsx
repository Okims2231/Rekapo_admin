import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import backgroundImage from '../assets/images/lvl fun!.jpg';
import backgroundAudio from '../assets/audio/Escape The Backrooms OST - Fun (You Day!) (Filtered Version).mp3';
import LevelFun from '../components/AdminFeatures/LevelFun';
import PartyEntities from '../components/AdminFeatures/PartyEntities';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminInterface() {
  const { logout } = useAuth();
  const audioRef = useRef(null);
  const [statistics, setStatistics] = useState(null);

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

  // Use dummy statistics data
  useEffect(() => {
    setStatistics({
      stat_date: new Date().toISOString().split('T')[0],
      total_users: 1247,
      active_users: 389,
      total_sessions: 5621,
      average_session_duration: 34.56
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // Force navigation to login so app re-evaluates auth state
      window.location.assign('/login');
    } catch (ex) {
      console.warn('Logout failed:', ex);
      // Ensure we still redirect to login
      window.location.assign('/login');
    }
  };

  const headerStyles = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: '20px',
    borderRadius: '20px'
  };
  const cardStyles = { 
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: '20px',
    padding: 20, 
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)' 
  };
  const gridStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 };
  const statBoxStyles = { 
    padding: 14, 
    borderRadius: 8, 
    background: 'rgba(194, 190, 190, 0.1)', 
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };
  const statNumber = { 
    fontSize: 26, fontWeight: 700, 
    color: '#ffffffff', 
    textShadow: '0 2px 4px rgba(0,0,0,0.5)', 
    fontFamily: 'Verdana, sans-serif' };
  const statLabel = { 
    color: '#cacacaff', marginTop: 6, 
    textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
    fontFamily: 'Verdana, sans-serif' };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '24px',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative'
    }}>
      {/* Dark overlay for better readability */}
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
      <audio ref={audioRef} loop autoPlay>
        <source src={backgroundAudio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Level Fun Component */}
      <LevelFun />

      {/* Party Entities Component */}
      <PartyEntities />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={headerStyles}>
          <div>
            <h1 style={{ 
              margin: 0, 
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
              fontFamily: 'Verdana, sans-serif' }}>Admin Dashboard</h1>
            <div style={{ 
              color: '#cacacaff', 
              marginTop: 6, 
              textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
              fontFamily: 'Verdana, sans-serif' }}>Overview & quick actions</div>
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

            <button 
              style={{ 
                padding: '8px 14px', 
                borderRadius: '25px', 
                border: '2px solid rgba(249, 115, 22, 0.6)', 
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.9), rgba(234, 88, 12, 0.9))', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                cursor: 'default',
                color: '#ffffff',
                fontFamily: 'Verdana, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)',
                boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)',
                transition: 'all 0.3s ease'
              }}
            >
              Dashboard
            </button>

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

        <div style={{ ...cardStyles }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', gap: 12, 
            flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#ffffffff', 
                textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
                fontFamily: 'Verdana, sans-serif' }}>System Statistics</h2>
              <div style={{ 
                color: '#cacacaff', 
                marginTop: 6, 
                textShadow: '0 1px 3px rgba(0,0,0,0.4)', 
                fontFamily: 'Verdana, sans-serif' }}>Latest snapshot</div>
            </div>
          </div>

          <div style={gridStyles}>
            <div 
              style={statBoxStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(15,23,42,0.06)';
              }}
            >
              <div style={statNumber}>{statistics?.stat_date || 'N/A'}</div>
              <div style={statLabel}>Statistics Date</div>
            </div>

            <div 
              style={statBoxStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(15,23,42,0.06)';
              }}
            >
              <div style={statNumber}>{statistics?.total_users ?? 'N/A'}</div>
              <div style={statLabel}>Total Users</div>
            </div>

            <div 
              style={statBoxStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(15,23,42,0.06)';
              }}
            >
              <div style={statNumber}>{statistics?.active_users ?? 'N/A'}</div>
              <div style={statLabel}>Active Users</div>
            </div>

            <div 
              style={statBoxStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(15,23,42,0.06)';
              }}
            >
              <div style={statNumber}>{statistics?.total_sessions ?? 'N/A'}</div>
              <div style={statLabel}>Total Sessions</div>
            </div>

            <div 
              style={statBoxStyles}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,23,42,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(194, 190, 190, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(15,23,42,0.06)';
              }}
            >
              <div style={statNumber}>{statistics?.average_session_duration ? statistics.average_session_duration.toFixed(2) : 'N/A'}</div>
              <div style={statLabel}>Avg Duration (min)</div>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            {/* Charts Section */}
            <h3 style={{ 
              margin: '20px 0 15px 0', 
              color: '#ffffffff', 
              textShadow: '0 2px 6px rgba(0,0,0,0.6)', 
              fontFamily: 'Verdana, sans-serif',
              fontSize: '18px'
            }}>Analytics Overview</h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              marginTop: 15
            }}>
              {/* Bar Chart - Users vs Sessions */}
              <div style={{
                ...cardStyles,
                padding: '20px'
              }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#ffffffff', 
                  fontFamily: 'Verdana, sans-serif',
                  fontSize: '16px'
                }}>Users & Sessions Overview</h4>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={[
                    {
                      name: 'Current',
                      'Total Users': statistics?.total_users || 0,
                      'Active Users': statistics?.active_users || 0,
                      'Total Sessions': statistics?.total_sessions || 0,
                    }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#cacacaff" />
                    <YAxis stroke="#cacacaff" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="Total Users" fill="#8b5cf6" />
                    <Bar dataKey="Active Users" fill="#06b6d4" />
                    <Bar dataKey="Total Sessions" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart - Active vs Inactive Users */}
              <div style={{
                ...cardStyles,
                padding: '20px'
              }}>
                <h4 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#ffffffff', 
                  fontFamily: 'Verdana, sans-serif',
                  fontSize: '16px'
                }}>User Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active Users', value: statistics?.active_users || 0 },
                        { name: 'Inactive Users', value: (statistics?.total_users || 0) - (statistics?.active_users || 0) }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      activeShape={{
                        filter: 'brightness(1.3)'
                      }}
                    >
                      <Cell fill="#06b6d4" />
                      <Cell fill="#6b7280" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                      formatter={(value, name) => [
                        <span style={{ color: name === 'Active Users' ? '#06b6d4' : '#6b7280', fontWeight: 'bold' }}>
                          {name}: {value}
                        </span>
                      ]}
                      cursor={{ fill: 'rgb(255, 255, 255)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart - Average Session Duration */}
            <div style={{
              ...cardStyles,
              padding: '20px',
              marginTop: 20
            }}>
              <h4 style={{ 
                margin: '0 0 15px 0', 
                color: '#ffffffff', 
                fontFamily: 'Verdana, sans-serif',
                fontSize: '16px'
              }}>Session Duration Metrics</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={[
                  {
                    name: 'Avg Duration',
                    'Duration (min)': statistics?.average_session_duration?.toFixed(2) || 0,
                  }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#cacacaff" />
                  <YAxis stroke="#cacacaff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    formatter={(value) => `${value} minutes`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="Duration (min)" 
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: '#f97316', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
