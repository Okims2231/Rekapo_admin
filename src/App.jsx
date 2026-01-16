import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SystemStatistics from './pages/SystemStatistics';
import UserManagement from './pages/UserManagement';
import SessionManagement from './pages/SessionManagement';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import AdminInterface from './pages/AdminInterface';
import Stats from './pages/Stats';
import { AdminProvider } from './components/AdminProvider';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/success" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <SystemStatistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sessions"
              element={
                <ProtectedRoute>
                  <SessionManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <SystemStatistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <SystemStatistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminInterface />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
