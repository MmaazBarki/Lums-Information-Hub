import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar, 
  Tooltip
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Videocam as VideocamIcon
} from '@mui/icons-material';
import { ConversationHeaderProps } from '../types';

const ConversationHeader: React.FC<ConversationHeaderProps> = ({ conversation }) => {
  if (!conversation) return null;
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        backgroundColor: (theme) => 
          theme.palette.mode === 'light' ? 'white' : theme.palette.background.paper,
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar 
          alt={conversation.name} 
          sx={{ mr: 2 }}
        >
          {conversation.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight="medium">
            {conversation.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {conversation.lastMessage}
          </Typography>
        </Box>
      </Box>
      
      <Box>
        <Tooltip title="Call">
          <IconButton size="small" sx={{ mx: 0.5 }}>
            <PhoneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Video call">
          <IconButton size="small" sx={{ mx: 0.5 }}>
            <VideocamIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="More options">
          <IconButton size="small" sx={{ mx: 0.5 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ConversationHeader;