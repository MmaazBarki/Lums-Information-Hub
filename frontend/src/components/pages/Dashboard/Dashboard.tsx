import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid,
  Box,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import { useAuth } from '../../../context/AuthContext';

interface DashboardProps {
  userType?: 'student' | 'alumni' | 'admin';
}

const Dashboard: React.FC<DashboardProps> = ({ userType = 'student' }) => {
  const { user } = useAuth();
  const profileData = user?.profile_data || {};
  
  const renderRoleSpecificContent = () => {
    switch(userType) {
      case 'admin':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
                <Typography variant="body1">
                  Welcome to the administrator dashboard. Manage users, review content, and monitor system activity.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    User Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Manage user accounts, permissions, and access levels.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Recent Account Activity</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="New student accounts created" 
                          secondary="24 in the last 7 days" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Alumni verification requests" 
                          secondary="7 pending review" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">View User List</Button>
                  <Button size="small">Review Requests</Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Content Moderation
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Review and manage user-generated content across the platform.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Moderation Queue</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Flagged posts" 
                          secondary="3 require review" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Job posting approvals" 
                          secondary="12 pending approval" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">Moderation Queue</Button>
                  <Button size="small">Content Settings</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        );
        
      case 'alumni':
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Alumni Dashboard</Typography>
                <Typography variant="body1">
                  Welcome back to LUMS! Stay connected with your alma mater and fellow alumni.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Alumni Network
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Connect with other alumni working in your industry.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Network Statistics</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: 'action.hover' }}>
                          <Typography variant="h4">1,240</Typography>
                          <Typography variant="caption">Industry Connections</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: 'action.hover' }}>
                          <Typography variant="h4">85</Typography>
                          <Typography variant="caption">Local Alumni</Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">View Network</Button>
                  <Button size="small">Update Profile</Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Job Postings
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Share opportunities at your organization with current students and recent graduates.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Your Postings</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Software Engineer Internship" 
                          secondary="Posted 2 days ago • 14 applications" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Marketing Associate" 
                          secondary="Posted 1 week ago • 27 applications" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">Create Posting</Button>
                  <Button size="small">View All</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        );
        
      default: // student dashboard
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>Student Dashboard</Typography>
                <Typography variant="body1">
                  Welcome to LUMS Information Hub! Access resources, connect with peers, and stay updated on campus activities.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Academic Resources
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Course materials, academic calendar, and study resources.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Recent Documents</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="CS360 - Final Project Guidelines" 
                          secondary="Updated 3 days ago" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="CS300 - Term Paper Template" 
                          secondary="Updated 1 week ago" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">View All Resources</Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Upcoming Events
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Stay updated on campus activities, workshops, and deadlines.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Career Fair" 
                          secondary="April 15, 2025 • 10:00 AM - 4:00 PM" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Software Engineering Workshop" 
                          secondary="April 20, 2025 • 2:00 PM" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Final Exam Period" 
                          secondary="May 5-15, 2025" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">View Calendar</Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div" gutterBottom>
                    Job Opportunities
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Internships, part-time jobs, and career resources.
                  </Typography>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>New Postings</Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Software Development Intern" 
                          secondary="XYZ Tech • Posted yesterday" 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Research Assistant" 
                          secondary="LUMS CS Department • Posted 3 days ago" 
                        />
                      </ListItem>
                    </List>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small">Browse Jobs</Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <Box>
      {renderRoleSpecificContent()}
    </Box>
  );
};

export default Dashboard;