import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  Box,
  CssBaseline,
  ThemeProvider,
  PaletteMode,
  CircularProgress,
} from '@mui/material';

// Import components
import Layout from './components/layout/Layout/Layout';
import Login from './components/pages/Auth/Login';
import Signup from './components/pages/Auth/Signup';

// Import theme
import { getTheme } from './theme/theme';

// Import Authentication Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route wrapper component that checks authentication
const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['student', 'alumni', 'admin'] 
}: { 
  children: React.ReactNode, 
  allowedRoles?: Array<'student' | 'alumni' | 'admin'> 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (user && !allowedRoles.includes(user.role)) {
    // Redirect based on user role if they're trying to access unauthorized content
    switch (user.role) {
      case 'student':
        return <Navigate to="/dashboard" replace />;
      case 'alumni':
        return <Navigate to="/alumni-dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Public routes that are only accessible when not logged in
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to appropriate dashboard if already authenticated
  if (isAuthenticated && user) {
    switch (user.role) {
      case 'student':
        return <Navigate to="/dashboard" replace />;
      case 'alumni':
        return <Navigate to="/alumni-dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

// Main App component
const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // Create theme based on current mode
  const theme = useMemo(() => getTheme(mode), [mode]);
  
  // Toggle theme mode (light/dark)
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Save/restore theme preference
  useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode === 'dark' || savedMode === 'light') {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Box sx={{ 
            width: '100%', 
            height: '100vh',
            padding: 0,
            margin: 0,
            overflow: 'hidden'
          }}>
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth routes - public access only */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              
              {/* All protected routes wrapped in a single Layout */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout toggleColorMode={toggleColorMode} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
