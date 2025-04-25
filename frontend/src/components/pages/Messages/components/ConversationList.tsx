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
  onSelectConversation, 
  onlineUsers = [],
  currentUserId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredUsers = conversations
    .filter(user => user._id !== currentUserId) 
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      {/* Conversations List (now User List) */}
      <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
        <List disablePadding>
          {filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            return (
              <React.Fragment key={user._id}> 
                <StyledListItem 
                  sx={{ 
                    backgroundColor: selectedConversationId === user._id
                      ? (theme) => theme.palette.action.selected 
                      : 'transparent'
                  }}
                  onClick={() => onSelectConversation(user._id)} 
                >
                  <ListItemAvatar>
                    {/* Add Badge for online status */}
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-dot': {
                          backgroundColor: isOnline ? '#44b700' : 'grey', 
                          boxShadow: (theme) => `0 0 0 2px ${theme.palette.background.paper}`,
                        }
                      }}
                    >
                      <Avatar alt={user.name} src={user.avatar}> 
                        {user.name.charAt(0)} 
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name} 
                  />
                </StyledListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default ConversationList;