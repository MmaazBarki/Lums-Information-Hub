import React, { useState, useMemo } from 'react';
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
import ForgotPassword from './components/pages/Auth/ForgotPassword';

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
    // Redirect to dashboard for all user roles
    return <Navigate to="/dashboard" replace />;
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
    // Single dashboard path for all users
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Main App component
const App: React.FC = () => {
  // Initialize state directly from localStorage or default to 'light'
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  // Create theme based on current mode
  const theme = useMemo(() => getTheme(mode), [mode]);
  
  // Toggle theme mode (light/dark)
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode); // Save immediately on toggle
      return newMode;
    });
  };

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
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPassword />
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
}
export default App;
