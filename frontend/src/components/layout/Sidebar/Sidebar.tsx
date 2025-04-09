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
import LogoutIcon from '@mui/icons-material/Logout';
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

  // Get user information from auth context
  const userInitials = user?.profile_data?.name
    ? `${user.profile_data.name.split(' ')[0][0]}${user.profile_data.name.split(' ')[1]?.[0] || ''}`
    : user?.email?.[0]?.toUpperCase() || 'U';
  
  const displayName = user?.profile_data?.name || user?.email || 'User';
  const role = user?.role || 'User';

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Messages', icon: <MailIcon />, path: '/messages' },
    { text: 'Posts', icon: <PostAddIcon />, path: '/posts' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' }
  ];

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
          component={Link}
          to="/profile"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            minHeight: 64,
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            cursor: 'pointer'
          }}
          onClick={() => setActiveSection('Profile')}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 40, 
                height: 40,
                bgcolor: 'primary.main'
              }}
            >
              {userInitials}
            </Avatar>
            {isDrawerOpen && (
              <Box sx={{ 
                minWidth: 0,
                opacity: isDrawerOpen ? 1 : 0,
                transition: (theme) => theme.transitions.create('opacity'),
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
              }}
              sx={{
                opacity: isDrawerOpen ? 1 : 0,
                visibility: isDrawerOpen ? 'visible' : 'hidden',
                transition: (theme) => theme.transitions.create(['opacity', 'visibility']),
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