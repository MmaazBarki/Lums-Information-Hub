import React from 'react';
import { Typography, Button, Paper } from '@mui/material';

const Messages: React.FC = () => {
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
};

export default Messages;