import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProductShowcase from '../../../assets/images/ProductShowcase.png';
import { useAuth } from '../../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }
    
    // Email validation including TLD check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address with a domain extension');
      setLoading(false);
      return;
    }

    try {
      await login(email, password);
      // Navigation will be handled in the AuthContext based on user role
    } catch (err) {
      console.log('Login error caught:', err);
      // Ensure the error is displayed and prevent form refresh
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          display: 'flex',
          height: '500px', // Fixed height for better vertical centering
          width: '900px',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Left side - Image */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            position: 'relative',
          }}
        >
          <img 
            src={ProductShowcase} 
            alt="Product Showcase" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </Box>

        {/* Right side - Form */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Centers content vertically
            p: 5,
          }}
        >
          <Box sx={{ 
            width: '100%',
            maxWidth: '350px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center', // Additional vertical centering
            flexGrow: 1 // Takes up available space
          }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Welcome Back
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
              Please sign in to continue
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                  autoComplete="email"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 1 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </Box>
            </form>
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Grid container>
                <Grid item xs>
                  <Link component={RouterLink} to="/forgot-password">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/signup">
                      Sign up
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;