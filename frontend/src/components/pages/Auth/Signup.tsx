import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ProductShowcase from '../../../assets/images/ProductShowcase.png';
import { useAuth } from '../../../context/AuthContext';
import { generateGroupedDepartmentOptions } from '../../../constants/departments.tsx'; // Update import path and function name


interface ProfileData {
  name?: string;
  department?: string;
  graduationYear?: string;
  rollNumber?: string;
}

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'alumni' | 'admin'>('student');
  const [profileData, setProfileData] = useState<ProfileData>({ department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();

  // Handle profile data change for TextField
  const handleProfileTextFieldChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle department change for Select
  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setProfileData(prev => ({
      ...prev,
      department: event.target.value as string
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Password validation regex - at least one capital letter and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least one capital letter and one special character');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Profile data validation for students and alumni
    if (role !== 'admin') {
      if (!profileData.name || !profileData.department) {
        setError('Name and Department are required for students and alumni');
        setLoading(false);
        return;
      }
      
      if (role === 'student' && !profileData.rollNumber) {
        setError('Roll number is required for students');
        setLoading(false);
        return;
      }
      
      if (role === 'alumni' && !profileData.graduationYear) {
        setError('Graduation year is required for alumni');
        setLoading(false);
        return;
      }
    }

    try {
      await signup({
        email,
        password,
        role,
        profile_data: role !== 'admin' ? profileData : undefined
      });
      
      // Navigation will be handled in the AuthContext based on user role
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
      setLoading(false);
    }
  };

  // Render role-specific profile fields
  const renderProfileFields = () => {
    if (role === 'admin') {
      return null; // No profile fields for admin
    }

    return (
      <>
        <TextField
          label="Full Name"
          value={profileData.name || ''}
          onChange={(e) => handleProfileTextFieldChange('name', e.target.value)}
          fullWidth
          required
        />
        {/* Department Dropdown */}
        <FormControl fullWidth required>
          <InputLabel id="department-select-label">Department</InputLabel>
          <Select
            labelId="department-select-label"
            value={profileData.department || ''}
            label="Department"
            onChange={handleDepartmentChange}
          >
            {generateGroupedDepartmentOptions()}
          </Select>
        </FormControl>
        
        {role === 'student' && (
          <TextField
            label="Roll Number"
            value={profileData.rollNumber || ''}
            onChange={(e) => handleProfileTextFieldChange('rollNumber', e.target.value)}
            fullWidth
            required
          />
        )}
        
        {role === 'alumni' && (
          <TextField
            label="Graduation Year"
            value={profileData.graduationYear || ''}
            onChange={(e) => handleProfileTextFieldChange('graduationYear', e.target.value)}
            fullWidth
            required
          />
        )}
      </>
    );
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
        overflow: 'hidden', // Prevent body overflow
        p: { xs: 2, md: 0 }, // Add padding on small screens
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          display: 'flex',
          maxHeight: { xs: '90vh', md: '80vh' }, // Max height with viewport units
          width: { xs: '100%', md: '900px' },
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Left side - Image */}
        <Box
          sx={{
            width: '50%',
            display: { xs: 'none', md: 'flex' }, // Hide on small screens
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            bgcolor: 'primary.light',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img 
              src={ProductShowcase} 
              alt="Product Showcase" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </Box>
        </Box>

        {/* Right side - Form */}
        <Box
          sx={{
            width: { xs: '100%', md: '50%' }, // Full width on small screens
            maxHeight: { xs: '90vh', md: '80vh' },
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto', // Enable vertical scrolling
            p: { xs: 3, md: 4 },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: (theme) => 
                theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
            }
          }}
        >
          <Box sx={{ 
            width: '100%',
            maxWidth: '350px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            py: 2,
          }}>
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Create Account
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
              Please fill in your details
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">I am a</InputLabel>
                  <Select
                    labelId="role-select-label"
                    value={role}
                    label="I am a"
                    onChange={(e) => setRole(e.target.value as 'student' | 'alumni' | 'admin')}
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="alumni">Alumni</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                  <FormHelperText>Select your role at LUMS</FormHelperText>
                </FormControl>

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
                  autoComplete="new-password"
                  helperText="Password must be at least 6 characters"
                />
                
                <TextField
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword || ''}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="new-password"
                />
                
                {/* Render role-specific profile fields */}
                {renderProfileFields()}
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 1 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign Up'}
                </Button>
              </Box>
            </form>
            
            <Box sx={{ mt: 4, mb: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;