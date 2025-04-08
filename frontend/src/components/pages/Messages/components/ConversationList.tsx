import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Typography, 
  Badge, 
  Divider,
  Box,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { ConversationListProps } from '../types';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(0, 0, 0, 0.04)' 
      : 'rgba(255, 255, 255, 0.08)'
  },
  padding: theme.spacing(2),
}));

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredConversations = conversations.filter(conversation => 
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box 
      sx={{ 
        width: '350px',
        height: '100%', 
        borderRight: 1, 
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Chats Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Typography variant="h6" fontWeight="bold">Chats</Typography>
        <IconButton size="small" color="primary">
          <AddIcon />
        </IconButton>
      </Box>
      
      {/* Search Box */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {/* Conversations List */}
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List disablePadding>
          {filteredConversations.map((conversation) => (
            <React.Fragment key={conversation.id}>
              <StyledListItem 
                sx={{ 
                  backgroundColor: selectedConversationId === conversation.id 
                    ? (theme) => theme.palette.action.selected 
                    : 'transparent'
                }}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <ListItemAvatar>
                  <Avatar alt={conversation.name}>
                    {conversation.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={conversation.name}
                  secondary={
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      noWrap 
                      sx={{ maxWidth: '150px' }}
                    >
                      {conversation.lastMessage}
                    </Typography>
                  }
                />
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="caption" color="text.secondary">
                    {conversation.timestamp}
                  </Typography>
                  {conversation.unread > 0 && (
                    <Badge 
                      badgeContent={conversation.unread} 
                      color="primary" 
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </StyledListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ConversationList;