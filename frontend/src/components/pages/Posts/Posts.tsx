import React from 'react';
import { Typography, Button, Paper } from '@mui/material';

const Posts: React.FC = () => {
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
};

export default Posts;