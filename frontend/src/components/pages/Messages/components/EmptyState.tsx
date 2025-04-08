import React from 'react';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface EmptyStateProps {
  onNewMessage: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onNewMessage }) => {
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
        No conversation selected
      </Typography>
      <Typography variant="body1" component="div" color="text.secondary" paragraph>
        Select a conversation from the list or start a new message
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<ChatBubbleOutlineIcon />}
        onClick={onNewMessage}
      >
        New Message
      </Button>
    </Box>
  );
};

export default EmptyState;