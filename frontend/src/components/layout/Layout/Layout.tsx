import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  Box,
  IconButton,
  Container,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Import components
import Sidebar from '../Sidebar/Sidebar';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Messages from '../../pages/Messages/Messages';
import Posts from '../../pages/Posts/Posts';
import Courses from '../../pages/Courses/Courses';

interface LayoutProps {
  toggleColorMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ toggleColorMode }) => {
  // Drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  
  // Get current location from React Router
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the active section from the URL path
  const getActiveSection = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };
  
  const activeSection = getActiveSection();
  
  // Media queries for responsive design
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Calculate drawer width based on open/closed state
  const drawerWidth = isDrawerOpen ? 240 : 64;
  
  // Toggle drawer open/closed
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
  
  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Function to handle navigation when sidebar item is clicked
  const handleSectionChange = (section: string) => {
    navigate(`/${section.toLowerCase()}`);
  };

  // Close the drawer when in mobile view
  useEffect(() => {
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      {/* Unified Top Bar */}
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
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              display: { sm: 'none' }, 
              mr: 1,
              color: (theme) => theme.palette.text.primary 
            }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Desktop toggle button */}
          <IconButton
            onClick={toggleDrawer}
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
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
            LUMS Info Hub
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
            width: { sm: drawerWidth }, 
            flexShrink: { sm: 0 },
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            })
          }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                mt: '64px', // Height of the top bar
                height: `calc(100% - 64px)`,
              },
            }}
          >
            <Sidebar 
              activeSection={activeSection}
              setActiveSection={handleSectionChange}
              mobileOpen={mobileOpen}
              handleDrawerToggle={handleDrawerToggle}
              drawerWidth={drawerWidth}
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
            />
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
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
              mobileOpen={mobileOpen}
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
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            overflow: 'auto',
            transition: theme => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Container maxWidth="lg">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Layout;