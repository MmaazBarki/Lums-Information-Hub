import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    onSendMessage(messageText);
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ 
      p: 2, 
      borderTop: 1, 
      borderColor: 'divider',
      backgroundColor: (theme) => theme.palette.background.paper,
      flexShrink: 0,
      zIndex: 2
    }}>
      <TextField
        fullWidth
        placeholder="Type a message..."
        variant="outlined"
        multiline
        maxRows={4}
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={handleKeyPress}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                color="primary" 
                onClick={handleSendMessage}
                disabled={messageText.trim() === ''}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default MessageInput;