import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  ListItemIcon,
  ListItemButton,
  Divider,
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MailIcon from '@mui/icons-material/Mail';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Messages', icon: <MailIcon /> },
    { text: 'Posts', icon: <PostAddIcon /> },
    { text: 'Courses', icon: <SchoolIcon /> }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (text) => {
    setActiveSection(text);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" noWrap component="div">
          LUMS Info Hub
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        )}
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                selected={activeSection === item.text}
                onClick={() => handleMenuItemClick(item.text)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Recent Announcements
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Latest updates and announcements from LUMS.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View All</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Upcoming Events
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check out upcoming events and activities.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View Calendar</Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    Quick Links
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access frequently used resources.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Resources</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        );
      case 'Messages':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Messages
            </Typography>
            <Typography paragraph>
              Your message inbox will appear here.
            </Typography>
            <Button variant="contained">New Message</Button>
          </Paper>
        );
      case 'Posts':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Posts
            </Typography>
            <Typography paragraph>
              Recent posts and discussions will appear here.
            </Typography>
            <Button variant="contained">Create Post</Button>
          </Paper>
        );
      case 'Courses':
        return (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Courses
            </Typography>
            <Typography paragraph>
              Your enrolled courses will appear here.
            </Typography>
            <Button variant="contained">Browse Courses</Button>
          </Paper>
        );
      default:
        return (
          <Typography paragraph>
            Select a menu item to view content.
          </Typography>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              {activeSection}
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: 8, sm: 8 } // Add margin top to account for AppBar
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 2 }}>
            {renderContent()}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
