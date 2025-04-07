import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Grid 
} from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item lg={4}>
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
      <Grid item lg={4}>
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
      <Grid item lg={4}>
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
};

export default Dashboard;