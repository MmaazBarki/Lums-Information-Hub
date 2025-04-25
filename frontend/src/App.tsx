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
    <BrowserRouter> {/* Move BrowserRouter to wrap AuthProvider */}
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* Routes are now descendants of BrowserRouter and AuthProvider */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Protected Routes */}
            <Route 
              path="/*" 
              element={
                <ProtectedRoute>
                  <Layout toggleColorMode={toggleColorMode}> 
                    {/* Nested routes are rendered within Layout's Outlet */}
                  </Layout>
                </ProtectedRoute>
              } 
            />
            {/* Define specific protected routes if needed, or handle within Layout */}
            {/* Example: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} /> */}
            
            {/* Fallback route - redirects authenticated users to dashboard, others to login */}
            <Route path="*" element={<Navigate to="/login" replace />} /> 
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
