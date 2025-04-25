import React, { useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider
} from '@mui/material';

// Import types
import { Message } from '../types';

// Update props interface to include currentUserId
interface MessageListProps {
  messages: Message[];
  currentUserId: string; 
}

// Destructure currentUserId from props
const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Group messages by date for better visual organization
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      // Use createdAt for date grouping, format it as needed
      const dateKey = new Date(message.createdAt).toLocaleDateString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric'
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? '#f5f5f5' : theme.palette.background.default,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: (theme) => 
            theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
        },
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0
      }}
    >
      {Object.entries(messageGroups).map(([date, dateMessages]) => (
        <Box key={date} sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2, 
              mt: 1,
              position: 'relative'
            }}
          >
            <Divider sx={{ flexGrow: 1 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                px: 2, 
                py: 0.5, 
                borderRadius: 1, 
                bgcolor: 'rgba(0,0,0,0.05)',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            >
              {date}
            </Typography>
          </Box>
          
          {dateMessages.map((message) => {
            // Determine if the message sender is the current user
            const isSelf = message.senderID === currentUserId;
            
            return (
              <Box
                key={message._id} // Use _id as key
                sx={{
                  display: 'flex',
                  justifyContent: isSelf ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: '70%',
                    borderRadius: 2,
                    backgroundColor: isSelf 
                      ? (theme) => theme.palette.primary.main
                      : (theme) => theme.palette.background.paper,
                    color: isSelf 
                      ? 'white' 
                      : (theme) => theme.palette.text.primary,
                    border: 1,
                    borderColor: isSelf
                      ? (theme) => theme.palette.primary.main
                      : 'divider',
                    boxShadow: isSelf 
                      ? '0 1px 2px rgba(0,0,0,0.1)' 
                      : '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Display image if present */}
                  {message.image && (
                    <Box sx={{ mb: message.text ? 1 : 0 }}>
                      <img 
                        src={message.image} 
                        alt="Sent image" 
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} 
                      />
                    </Box>
                  )}
                  {/* Display text if present */}
                  {message.text && (
                    <Typography variant="body1" component="div">{message.text}</Typography>
                  )}
                  <Typography 
                    variant="caption" 
                    component="div"
                    color={isSelf ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                    sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}
                  >
                    {/* Format createdAt timestamp */}
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;