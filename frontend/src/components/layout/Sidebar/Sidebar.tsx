import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  List, 
  ListItem,
  useMediaQuery,
  Tooltip,
  Avatar,
  Typography,
  Divider
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SchoolIcon from '@mui/icons-material/School';

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
  handleDrawerToggle,
  isDrawerOpen,
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Messages', icon: <MailIcon />, path: '/messages' },
    { text: 'Posts', icon: <PostAddIcon />, path: '/posts' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/courses' }
  ];

  const handleMenuItemClick = (text: string) => {
    setActiveSection(text);
    if (isMobile) {
      handleDrawerToggle();
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
            gap: 2,
            minHeight: 64,
          }}
        >
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40,
              bgcolor: 'primary.main'
            }}
          >
            JD
          </Avatar>
          {isDrawerOpen && (
            <Box sx={{ 
              minWidth: 0,
              opacity: isDrawerOpen ? 1 : 0,
              transition: (theme) => theme.transitions.create('opacity'),
            }}>
              <Typography noWrap variant="body2" fontWeight="500">
                John Doe
              </Typography>
              <Typography noWrap variant="caption" color="text.secondary">
                Student
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;