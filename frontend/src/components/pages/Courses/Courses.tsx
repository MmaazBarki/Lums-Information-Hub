import React from 'react';
import { Typography, Button, Paper } from '@mui/material';

const Courses: React.FC = () => {
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
};

export default Courses;