import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface EmptyStateProps {
  message?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
        p: 3,
        textAlign: 'center'
      }}
    >
      <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        {message || 'No conversation selected'}
      </Typography>
      <Typography variant="body1" component="div" color="text.secondary" paragraph>
        {message ? '' : 'Select a conversation from the list to start chatting.'}
      </Typography>
    </Box>
  );
};

export default EmptyState;