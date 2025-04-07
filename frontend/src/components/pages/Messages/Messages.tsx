import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  TextField, 
  IconButton,
  InputAdornment,
  // Divider,
  Badge,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// Import mock data
import { mockConversations } from '../../../mock/conversations';
import { mockMessages } from '../../../mock/messages';

const Messages: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Filter conversations based on search query
  const filteredConversations = mockConversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (messageText.trim() === '') return;
    
    // In a real app, this would send the message to the backend
    console.log(`Sending message to ${selectedUser}: ${messageText}`);
    
    // Clear the input field after sending
    setMessageText('');
  };

  // Handle pressing Enter to send a message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom of messages when conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedUser]);

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: 'calc(100vh - 160px)', // Adjust for the toolbar and main padding
        display: 'flex', 
        flexDirection: 'row',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Left side - Users/Conversations List */}
      <Box sx={{ 
        width: '350px', 
        borderRight: 1, 
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          backgroundColor: (theme) => theme.palette.background.paper,
          flexShrink: 0
        }}>
          <Typography variant="h6" gutterBottom>
            Messages
          </Typography>
          <TextField
            placeholder="Search conversations"
            fullWidth
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <List 
          sx={{ 
            flexGrow: 1,
            overflowY: 'auto',
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
            '& .MuiListItem-root': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            }
          }}
        >
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <ListItem 
                key={conv.id}
                disablePadding
                sx={{ 
                  backgroundColor: selectedUser === conv.id 
                    ? (theme) => theme.palette.action.selected 
                    : 'transparent'
                }}
              >
                <ListItemButton onClick={() => handleUserSelect(conv.id)}>
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      color={conv.isOnline ? "success" : "default"}
                    >
                      <Avatar 
                        alt={conv.name} 
                        src={conv.avatar}
                        sx={{ bgcolor: (theme) => conv.isOnline ? theme.palette.success.main : theme.palette.primary.main }}
                      >
                        {conv.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography 
                          variant="body1" 
                          component="span"
                          sx={{ 
                            fontWeight: conv.unread > 0 ? 'bold' : 'normal',
                          }}
                        >
                          {conv.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          component="span"
                          color="text.secondary"
                        >
                          {conv.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 0.5
                      }}>
                        <Typography 
                          variant="body2" 
                          component="span"
                          sx={{ 
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px',
                            fontWeight: conv.unread > 0 ? 'medium' : 'normal',
                          }}
                        >
                          {conv.lastMessage}
                        </Typography>
                        {conv.unread > 0 && (
                          <Badge 
                            badgeContent={conv.unread} 
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText 
                primary={
                  <Typography component="span">No conversations found</Typography>
                } 
                secondary={
                  <Typography component="span" variant="body2">Try a different search term</Typography>
                } 
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ p: 1, borderTop: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Button 
            variant="contained" 
            fullWidth
            startIcon={<ChatBubbleOutlineIcon />}
          >
            New Message
          </Button>
        </Box>
      </Box>

      {/* Right side - Message Content Area */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {selectedUser ? (
          <>
            {/* Conversation Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider',
              backgroundColor: (theme) => theme.palette.background.paper,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
              zIndex: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color={mockConversations.find(c => c.id === selectedUser)?.isOnline ? "success" : "default"}
                >
                  <Avatar 
                    alt={mockConversations.find(c => c.id === selectedUser)?.name} 
                    src={mockConversations.find(c => c.id === selectedUser)?.avatar}
                    sx={{ mr: 2 }}
                  >
                    {mockConversations.find(c => c.id === selectedUser)?.name.charAt(0)}
                  </Avatar>
                </Badge>
                <Typography variant="h6">
                  {mockConversations.find(c => c.id === selectedUser)?.name}
                </Typography>
              </Box>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Box>

            {/* Message List */}
            <Box 
              ref={messageListRef}
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
                }
              }}
            >
              {mockMessages[selectedUser as keyof typeof mockMessages]?.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'self' ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '70%',
                      borderRadius: 2,
                      backgroundColor: message.sender === 'self' 
                        ? (theme) => theme.palette.primary.main
                        : (theme) => theme.palette.background.paper,
                      color: message.sender === 'self' 
                        ? 'white' 
                        : (theme) => theme.palette.text.primary,
                    }}
                  >
                    <Typography variant="body1" component="div">{message.text}</Typography>
                    <Typography 
                      variant="caption" 
                      component="div"
                      color={message.sender === 'self' ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                      sx={{ display: 'block', mt: 0.5, textAlign: 'right' }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input */}
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
          </>
        ) : (
          // Empty state when no conversation is selected
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
            >
              New Message
            </Button>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Messages;