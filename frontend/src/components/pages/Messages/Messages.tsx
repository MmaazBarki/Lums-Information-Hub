import React from 'react';
import { Box } from '@mui/material';

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
    conversations,
    currentConversation,
    currentMessages,
    selectedUserId,
    searchQuery,
    setSearchQuery,
    handleSelectUser,
    handleSendMessage,
    handleNewMessage
  } = useMessages();

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 164px)', 
      overflow: 'hidden',
      backgroundColor: (theme) => theme.palette.background.paper,
    }}>
      {/* Conversations List */}
      <ConversationList 
        conversations={conversations}
        selectedConversationId={selectedUserId}
        onSelectConversation={handleSelectUser}
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
          <ConversationHeader conversation={currentConversation ?? null} />
          <MessageList messages={currentMessages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <EmptyState onNewMessage={handleNewMessage} />
        </Box>
      )}
    </Box>
  );
};

export default Messages;