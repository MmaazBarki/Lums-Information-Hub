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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ProductShowcase from '../../../assets/images/ProductShowcase.png';
import { useAuth } from '../../../context/AuthContext';
import { generateGroupedDepartmentOptions } from '../../../constants/departments';

interface ProfileData {
  name?: string;
  department?: string;
  batch?: string;
}

interface UserData {
  email: string;
  password: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data?: ProfileData;
}

const Signup: React.FC = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'alumni' | 'admin'>('student');
  const [profileData, setProfileData] = useState<ProfileData>({ department: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleProfileTextFieldChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setProfileData(prev => ({
      ...prev,
      department: event.target.value as string
    }));
  };

  const handleInitialSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

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


    if (role !== 'admin' && !profileData.name) {
      setError('Full Name is required');
      setLoading(false);
      return;
    }

    if (role !== 'admin') {
      if (!profileData.department) {
        setError('Department is required for students and alumni');
        setLoading(false);
        return;
      }

      if (role === 'alumni' && !profileData.batch) {
        setError('Graduation year is required for alumni');
        setLoading(false);
        return;
      }
    }

    try {

      let userProfileData: ProfileData = {};
      
      if (role !== 'admin') {
        userProfileData = {
          name: profileData.name,
          department: profileData.department,
        };
        
        if (role === 'alumni') {
          userProfileData.batch = profileData.batch;
        }
      }

      const newUserData = {
        email,
        password,
        role,
        profile_data: role === 'admin' ? undefined : userProfileData
      };

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      console.log("pending user data in response", data.data.pendingUser);

      setUserData(data.data.pendingUser);
      setSuccessMessage('An OTP has been sent to your email. Please check your inbox.');
      setStep('otp');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (!otp) {
      setError('Please enter the OTP sent to your email');
      setLoading(false);
      return;
    }

    if (!userData) {
      setError('Session expired. Please start the signup process again.');
      setStep('form');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          otp,
          userData,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!userData) {
      setError('Session expired. Please start the signup process again.');
      setStep('form');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/resend-signup-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userData.email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      setSuccessMessage('A new OTP has been sent to your email');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileFields = () => {

    if (role === 'admin') {
      return null;
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

        {role === 'alumni' && (
          <TextField
            label="Graduation Year"
            value={profileData.batch || ''}
            onChange={(e) => handleProfileTextFieldChange('batch', e.target.value)}
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
        overflow: 'hidden',
        py: { xs: 4, sm: 0 },
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          width: '95%',
          maxWidth: '1200px',
          height: { xs: 'auto', md: '80vh' },
          overflow: 'hidden',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 2,
        }}
      >
        <Box 
          sx={{ 
            width: { xs: '100%', md: '50%' },
            display: { xs: 'none', md: 'block' },
            bgcolor: 'primary.main',
            position: 'relative',
            minHeight: { xs: '200px', md: 'unset' },
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

        <Box
          sx={{
            width: { xs: '100%', md: '50%' },
            maxHeight: { xs: '90vh', md: '80vh' },
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
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
              {step === 'form' ? 'Create Account' : 'Verify Email'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
              {step === 'form' 
                ? 'Please fill in your details' 
                : `We've sent a verification code to ${email}`
              }
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
            
            {step === 'form' ? (
              <form onSubmit={handleInitialSignup}>
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
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Verification Code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                    inputProps={{ maxLength: 4 }}
                  />
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 1 }}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Verify'}
                  </Button>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Button 
                      onClick={handleResendOTP} 
                      disabled={loading}
                      size="small"
                    >
                      Resend Code
                    </Button>
                    <Button 
                      onClick={() => setStep('form')} 
                      disabled={loading}
                      size="small"
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </form>
            )}
            
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