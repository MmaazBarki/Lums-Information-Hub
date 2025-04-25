import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Box,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  List, 
  ListItem,
  Tooltip,
  Avatar,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../../../context/AuthContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth: number;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  isDrawerOpen,
}) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const userInitials = user?.profile_data?.name
    ? `${user.profile_data.name.split(' ')[0][0]}${user.profile_data.name.split(' ')[1]?.[0] || ''}`
    : user?.email?.[0]?.toUpperCase() || 'U';
  
  const displayName = user?.profile_data?.name || user?.email || 'User';
  const role = user?.role || 'User';

  let menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Messages', icon: <MailIcon />, path: '/messages' },
    { text: 'Posts', icon: <PostAddIcon />, path: '/posts' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Bookmarks', icon: <BookmarkIcon />, path: '/bookmarks' }
  ];

  if (user?.role === 'admin') {
    menuItems.push({ 
      text: 'Admin', 
      icon: <AdminPanelSettingsIcon />, 
      path: '/admin' 
    });
  }

  const handleMenuItemClick = (text: string) => {
    setActiveSection(text);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100%',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main menu items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding
              component={Link} 
              to={item.path}
              sx={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <Tooltip title={isDrawerOpen ? "" : item.text} placement="right">
                <ListItemButton 
                  selected={activeSection === item.text}
                  onClick={() => handleMenuItemClick(item.text)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isDrawerOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                    },
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isDrawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {isDrawerOpen && (
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        opacity: isDrawerOpen ? 1 : 0,
                        transition: (theme) => theme.transitions.create('opacity'),
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Profile section at bottom */}
      <Box sx={{ mt: 'auto' }}>
        <Divider />
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 64,
          }}
        >
          <Box
            component={Link}
            to="/profile"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              cursor: 'pointer',
              borderRadius: 1,
              px: 1,
              overflow: 'hidden', // Add overflow hidden to prevent content from expanding
              maxWidth: isDrawerOpen ? 'calc(100% - 48px)' : 'auto', // Reserve space for the logout button
            }}
            onClick={() => setActiveSection('Profile')}
          >
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'primary.main',
                flexShrink: 0, // Prevent avatar from shrinking
              }}
            >
              {userInitials}
            </Avatar>
            {isDrawerOpen && (
              <Box sx={{ 
                minWidth: 0,
                opacity: isDrawerOpen ? 1 : 0,
                transition: (theme) => theme.transitions.create('opacity'),
                overflow: 'hidden', // Add overflow hidden to clip text
                width: '100%', // Ensure the text container takes available width
              }}>
                <Typography noWrap variant="body2" fontWeight="500">
                  {displayName}
                </Typography>
                <Typography noWrap variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                  {role}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Tooltip title="Logout">
            <IconButton 
              onClick={handleLogout}
              size="medium"
              sx={{
                ml: 1,
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;