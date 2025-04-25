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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import { generateGroupedDepartmentOptions } from '../../../constants/departments';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [profileFormData, setProfileFormData] = useState({
    name: user?.profile_data?.name || '',
    email: user?.email || '',
    alternateEmail: user?.profile_data?.alternate_email || '',
    department: user?.profile_data?.department || '',
    batch: user?.profile_data?.batch || '',
    bio: user?.profile_data?.bio || '',
  });
  
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

  const handleProfileTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
    setProfileFormData(prev => ({
      ...prev,
      department: event.target.value as string
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setPasswordErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const toggleEditMode = () => {
   if (editMode) {
      setProfileFormData({
        name: user?.profile_data?.name || '',
        email: user?.email || '',
        alternateEmail: user?.profile_data?.alternate_email || '',
        department: user?.profile_data?.department || '',
        batch: user?.profile_data?.batch || '',
        bio: user?.profile_data?.bio || '',
      });
    }
    setEditMode(!editMode);
  };

  const handleSubmitProfile = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          name: profileFormData.name,
          department: profileFormData.department,
          alternate_email: profileFormData.alternateEmail,
          batch: profileFormData.batch,
          bio: profileFormData.bio,
        }),
      });
      
      const updatedUser = await response.json();
      
      if (!response.ok) {
        throw new Error(updatedUser.message || 'Failed to update profile');
      }
      
      if (updatedUser) {
        updateUser({
          ...user,
          profile_data: updatedUser.profile_data || user?.profile_data
        });
      }
      
      setNotification({
        type: 'success',
        message: 'Profile updated successfully'
      });
      
      setEditMode(false);
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile'
      });
      console.error('Error updating profile:', error);
    }
  };

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

  const handleSubmitPasswordChange = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/update-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
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

  const handleCloseNotification = () => {
    setNotification(null);
  };

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
                        onChange={handleProfileTextFieldChange}
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
                        onChange={handleProfileTextFieldChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="department-select-label">Department</InputLabel>
                        <Select
                          labelId="department-select-label"
                          name="department"
                          value={profileFormData.department || ''}
                          label="Department"
                          onChange={handleDepartmentChange}
                        >
                          {generateGroupedDepartmentOptions()}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Batch / Year"
                        name="batch"
                        value={profileFormData.batch}
                        onChange={handleProfileTextFieldChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Bio"
                        name="bio"
                        value={profileFormData.bio}
                        onChange={handleProfileTextFieldChange}
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
                      <Typography variant="body1">{user?.profile_data?.alternate_email || 'Not specified'}</Typography>
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
