import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  Box,
  IconButton,
  Container
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import components
import Sidebar from '../Sidebar/Sidebar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Messages from '../../pages/Messages/Messages';
import Posts from '../../pages/Posts/Posts';
import Courses from '../../pages/Courses/Courses';
import Profile from '../../pages/Profile/Profile';
import { useAuth } from '../../../context/AuthContext';

interface LayoutProps {
  toggleColorMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ toggleColorMode }) => {
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  
  // Get current location from React Router
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extract the active section from the URL path
  const getActiveSection = () => {
    const path = location.pathname.split('/')[1] || '';
    
    if (path.includes('dashboard')) return 'Dashboard';
    if (path === 'messages') return 'Messages';
    if (path === 'posts') return 'Posts';
    if (path === 'courses') return 'Courses';
    
    return 'Dashboard';
  };
  
  const activeSection = getActiveSection();
  
  // Calculate drawer width based on open/closed state
  const drawerWidth = isDrawerOpen ? 240 : 64;
  
  // Toggle drawer open/closed
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  // Function to handle navigation when sidebar item is clicked
  const handleSectionChange = (section: string) => {
    // Simplified navigation - all users go to the same dashboard route
    navigate(`/${section.toLowerCase()}`);
  };

  // Dummy functions for compatibility
  const handleDrawerToggle = () => {}; 

  return (
    <>
      {/* Top Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: (theme) => theme.palette.background.default,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {/* Desktop toggle button */}
          <IconButton
            onClick={toggleDrawer}
            sx={{ 
              mr: 2,
              color: (theme) => theme.palette.text.primary
            }}
          >
            {isDrawerOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>

          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              color: (theme) => theme.palette.text.primary,
              fontWeight: 500
            }}
          >
            LUMS Info Hub {user && `- ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal`}
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          
          {/* Theme toggle button */}
          <ThemeToggle toggleColorMode={toggleColorMode} />
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexGrow: 1,
          mt: '64px', // Height of the top bar
          overflow: 'hidden'
        }}
      >
        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ 
            width: drawerWidth, 
            flexShrink: 0,
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            })
          }}
        >
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                mt: '64px', // Height of the top bar
                height: `calc(100% - 64px)`,
                overflowX: 'hidden',
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                transition: theme => theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              },
            }}
            open
          >
            <Sidebar 
              activeSection={activeSection}
              setActiveSection={handleSectionChange}
              mobileOpen={false}
              handleDrawerToggle={handleDrawerToggle}
              drawerWidth={drawerWidth}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
            />
          </Drawer>
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: `calc(100% - ${drawerWidth}px)`,
            overflow: 'auto',
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Container maxWidth="lg">
            <Routes>
              {/* Single dashboard for all roles */}
              <Route path="/dashboard" element={<Dashboard userType={user?.role || 'student'} />} />
              
              {/* Common routes for all users */}
              <Route path="/messages/*" element={<Messages />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Only redirect the root path to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Layout;