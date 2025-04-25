import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

import ConversationList from './components/ConversationList';
import ConversationHeader from './components/ConversationHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import EmptyState from './components/EmptyState';

import useMessages from './hooks/useMessages';

const Messages: React.FC = () => {
  const {
    users, 
    currentConversationUser, 
    currentMessages,
    selectedUserId,
    handleSelectUser,
    handleSendMessage,
    loading,
    error,
    currentUserId,
    onlineUsers,
  } = useMessages();

  if (loading && !users.length) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!currentUserId) {
    return <Alert severity="warning">Authenticating...</Alert>;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 164px)', 
      overflow: 'hidden',
      backgroundColor: (theme) => theme.palette.background.paper,
    }}>
      {/* Conversations List (User List) */}
      <ConversationList 
        conversations={users} 
        selectedConversationId={selectedUserId}
        onSelectConversation={handleSelectUser}
        onlineUsers={onlineUsers} 
        currentUserId={currentUserId}
      />
      
      {/* Chat Area */}
      {selectedUserId ? (
        <Box sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          <ConversationHeader conversation={currentConversationUser ?? null} /> 
          <MessageList messages={currentMessages} currentUserId={currentUserId} />
          <MessageInput onSendMessage={handleSendMessage} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <EmptyState message="Select a user to start chatting" /> 
        </Box>
      )}
    </Box>
  );
};

export default Messages;