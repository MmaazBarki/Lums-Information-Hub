import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';
import { 
  Box, 
  Popover, 
  Typography, 
  Badge, 
  IconButton, 
  Button, 
  Paper, 
  useTheme,
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationComponent: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const navigate = useNavigate();
  const theme = useTheme();
  
  useEffect(() => {
    if (anchorEl) {
      fetchNotifications();
    }
  }, [anchorEl, fetchNotifications]);
  
  const handleNotificationClick = async (notification: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (notification.isRead) {
      navigateToContent(notification);
      return;
    }
    
    try {
      setLoading(true);
      setMarkingId(notification._id);
      
      await markAsRead(notification._id);
      
      navigateToContent(notification);
    } catch (error) {
      console.error('Error handling notification click:', error);
      alert('Failed to mark notification as read');
    } finally {
      setLoading(false);
      setMarkingId(null);
      handleClose();
    }
  };
  
  const navigateToContent = (notification: any) => {
    if (notification.type === 'post') {
      navigate(`/posts`);
    } else if (notification.type === 'message') {
      navigate(`/messages`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAllAsReadClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      setLoading(true);
      await markAllAsRead();
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
      alert('Failed to mark all notifications as read');
    } finally {
      setLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        size="large"
        color="inherit"
        sx={{ mr: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error" sx={{
          '& .MuiBadge-badge': {
            fontSize: '0.7rem',
            height: '20px',
            minWidth: '20px',
            padding: '0 6px'
          }
        }}>
          <NotificationsIcon sx={{ fontSize: '2rem', color: theme.palette.text.primary }} />
        </Badge>
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: { 
            width: 350, 
            maxHeight: 400
          }
        }}
      >
        <Paper sx={{ width: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}>
            <Typography variant="h6" color="textPrimary">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button 
                variant="contained"
                color="primary"
                size="small" 
                onClick={handleMarkAllAsReadClick}
                disabled={loading}
                startIcon={loading && <CircularProgress size={16} color="inherit" />}
                sx={{ 
                  minWidth: 'auto',
                  textTransform: 'none'
                }}
              >
                Mark all read
              </Button>
            )}
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">No notifications</Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              {notifications.map((notification) => (
                <Box
                  key={notification._id}
                  onClick={(e) => handleNotificationClick(notification, e)}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    position: 'relative',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    backgroundColor: notification.isRead 
                      ? 'transparent' 
                      : theme.palette.mode === 'light'
                        ? 'rgba(25, 118, 210, 0.08)'
                        : 'rgba(144, 202, 249, 0.08)',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.04)'
                        : 'rgba(255, 255, 255, 0.08)'
                    }
                  }}
                >
                  {markingId === notification._id && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        zIndex: 1
                      }}
                    >
                      <CircularProgress size={24} />
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography 
                      variant="body2" 
                      color="textPrimary"
                      sx={{ 
                        fontWeight: notification.isRead ? 'normal' : 'bold',
                        flexGrow: 1,
                        mr: 1
                      }}
                    >
                      {notification.content}
                    </Typography>
                    {!notification.isRead && (
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette.primary.main,
                          flexShrink: 0
                        }} 
                      />
                    )}
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="textSecondary" 
                    sx={{ mt: 0.5, display: 'block' }}
                  >
                    {formatDate(notification.createdAt)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Popover>
    </>
  );
};

export default NotificationComponent;