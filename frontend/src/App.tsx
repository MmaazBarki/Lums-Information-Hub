import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  Box,
  CssBaseline,
  ThemeProvider,
  PaletteMode,
  CircularProgress,
} from '@mui/material';

import Layout from './components/layout/Layout/Layout';
import Login from './components/pages/Auth/Login';
import Signup from './components/pages/Auth/Signup';
import ForgotPassword from './components/pages/Auth/ForgotPassword';

import { getTheme } from './theme/theme';

import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['student', 'alumni', 'admin'] 
}: { 
  children: React.ReactNode, 
  allowedRoles?: Array<'student' | 'alumni' | 'admin'> 
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  const theme = useMemo(() => getTheme(mode), [mode]);
  
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode); 
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
