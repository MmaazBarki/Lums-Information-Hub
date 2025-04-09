import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  // Profile form state
  const [profileFormData, setProfileFormData] = useState({
    name: user?.profile_data?.name || '',
    email: user?.email || '',
    alternateEmail: user?.profile_data?.alternateEmail || '',
    department: user?.profile_data?.department || '',
    batch: user?.profile_data?.batch || '',
    bio: user?.profile_data?.bio || '',
  });
  
  // Password change form state
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear the error for this field as user types
    setPasswordErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (editMode) {
      // If switching from edit to view, reset the form data
      setProfileFormData({
        name: user?.profile_data?.name || '',
        email: user?.email || '',
        alternateEmail: user?.profile_data?.alternateEmail || '',
        department: user?.profile_data?.department || '',
        batch: user?.profile_data?.batch || '',
        bio: user?.profile_data?.bio || '',
      });
    }
    setEditMode(!editMode);
  };

  // Submit profile changes
  const handleSubmitProfile = async () => {
    try {
      // Here you would typically call an API to update the profile
      // For now we'll just simulate a successful update
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully'
      });
      
      setEditMode(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update profile'
      });
      console.error('Error updating profile:', error);
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    let valid = true;
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };

    if (!passwordFormData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      valid = false;
    }

    if (!passwordFormData.newPassword) {
      errors.newPassword = 'New password is required';
      valid = false;
    } else if (passwordFormData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    } else {
      // Password validation regex - at least one capital letter and one special character
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
      if (!passwordRegex.test(passwordFormData.newPassword)) {
        errors.newPassword = 'Password must contain at least one capital letter and one special character';
        valid = false;
      }
    }

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setPasswordErrors(errors);
    return valid;
  };

  // Submit password change
  const handleSubmitPasswordChange = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      // Call the backend API to update the password
      const response = await fetch('http://localhost:5001/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for sending cookies
        body: JSON.stringify({
          oldPassword: passwordFormData.currentPassword,
          newPassword: passwordFormData.newPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      setNotification({
        type: 'success',
        message: data.message || 'Password changed successfully'
      });
      
      setPasswordDialogOpen(false);
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to change password'
      });
      console.error('Error changing password:', error);
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification(null);
  };

  // Generate avatar initials from name
  const getInitials = () => {
    const name = user?.profile_data?.name || '';
    return name.split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Box sx={{ 
      p: 1, 
      height: 'calc(100vh - 100px)', 
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '100%'
    }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Divider />
      </Box>

      {/* Profile Information Card */}
      <Box sx={{ overflow: 'visible', pb: 6 }}>
        <Grid container spacing={3} sx={{ maxWidth: '100%' }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader
              title="Profile Information"
              action={
                <Button 
                  startIcon={editMode ? <SaveIcon /> : <EditIcon />} 
                  onClick={editMode ? handleSubmitProfile : toggleEditMode}
                  color={editMode ? "primary" : "inherit"}
                  variant={editMode ? "contained" : "text"}
                >
                  {editMode ? 'Save' : 'Edit'}
                </Button>
              }
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 80,
                    height: 80,
                    fontSize: 32,
                    mb: 2
                  }}
                >
                  {getInitials()}
                </Avatar>
                <Typography variant="h6">
                  {user?.profile_data?.name || 'User'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {user?.role || 'User'}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                {editMode ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profileFormData.name}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={profileFormData.email}
                        disabled
                        helperText="Email cannot be changed"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Alternate Email"
                        name="alternateEmail"
                        value={profileFormData.alternateEmail}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Department"
                        name="department"
                        value={profileFormData.department}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Batch / Year"
                        name="batch"
                        value={profileFormData.batch}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={profileFormData.bio}
                        onChange={handleProfileChange}
                        multiline
                        rows={4}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{user?.email || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Alternate Email</Typography>
                      <Typography variant="body1">{user?.profile_data?.alternateEmail || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                      <Typography variant="body1">{user?.profile_data?.department || 'Not specified'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Batch / Year</Typography>
                      <Typography variant="body1">{user?.profile_data?.batch || 'Not specified'}</Typography>
                    </Grid>
                    {user?.profile_data?.bio && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Bio</Typography>
                        <Typography variant="body1">{user?.profile_data?.bio}</Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
              </Box>
            </CardContent>
            {!editMode && (
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordDialogOpen(true)}
                >
                  Change Password
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardHeader title="Account Information" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Account Type</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{user?.role || 'User'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Account Status</Typography>
                  <Typography variant="body1">Active</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Member Since</Typography>
                  <Typography variant="body1">January 2024</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          {/* You could add additional cards here for other profile-related information */}
        </Grid>
      </Grid>
      
      {/* Change Password Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={() => setPasswordDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            maxHeight: '80vh',
            overflowY: 'auto'
          }
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter your current password and a new password.
          </DialogContentText>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordFormData.currentPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.currentPassword}
                helperText={passwordErrors.currentPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordFormData.newPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.newPassword}
                helperText={passwordErrors.newPassword}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordFormData.confirmPassword}
                onChange={handlePasswordChange}
                error={!!passwordErrors.confirmPassword}
                helperText={passwordErrors.confirmPassword}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitPasswordChange} variant="contained">Change Password</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      {notification && (
        <Snackbar 
          open={true}
          autoHideDuration={6000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseNotification} 
            severity={notification.type} 
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </Box>

    </Box>
  );
};

export default Profile;
