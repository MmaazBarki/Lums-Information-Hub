import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  Box,
  CssBaseline,
  ThemeProvider,
  PaletteMode,
} from '@mui/material';

// Import components
import Layout from './components/layout/Layout/Layout';
import Login from './components/pages/Auth/Login';
import Signup from './components/pages/Auth/Signup';

// Import theme
import { getTheme } from './theme/theme';

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Implement actual auth check
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
            
            {/* Auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
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
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
