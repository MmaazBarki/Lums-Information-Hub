import React from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';

// Import custom components
import ConversationList from './components/ConversationList';
import ConversationHeader from './components/ConversationHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import EmptyState from './components/EmptyState';

// Import custom hooks
import useMessages from './hooks/useMessages';

const Messages: React.FC = () => {
  const {
    users, // Changed from conversations
    currentConversationUser, // Changed from currentConversation
    currentMessages,
    selectedUserId,
    // searchQuery, // Removed for now
    // setSearchQuery, // Removed for now
    handleSelectUser,
    handleSendMessage,
    // handleNewMessage, // Removed, EmptyState doesn't need it now
    loading,
    error,
    currentUserId,
    onlineUsers, // Added onlineUsers
  } = useMessages();

  if (loading && !users.length) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!currentUserId) {
    // Should ideally not happen if AuthProvider handles loading state correctly
    return <Alert severity="warning">Authenticating...</Alert>;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 164px)', // Adjust height based on your Layout
      overflow: 'hidden',
      backgroundColor: (theme) => theme.palette.background.paper,
    }}>
      {/* Conversations List (now User List) */}
      <ConversationList 
        conversations={users} // Pass users array
        selectedConversationId={selectedUserId}
        onSelectConversation={handleSelectUser}
        onlineUsers={onlineUsers} // Pass online users
        currentUserId={currentUserId} // Pass current user ID to filter self
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
          {/* Pass the user object to the header */}
          <ConversationHeader conversation={currentConversationUser ?? null} /> 
          <MessageList messages={currentMessages} currentUserId={currentUserId} />
          <MessageInput onSendMessage={handleSendMessage} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {/* Removed onNewMessage from EmptyState */}
          <EmptyState message="Select a user to start chatting" /> 
        </Box>
      )}
    </Box>
  );
};

export default Messages;