import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '../types';

// In a real app, these would come from an API
import { conversations as mockConversations } from '../../../../mock/conversations';
import { messages as mockMessages } from '../../../../mock/messages';

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    setConversations(mockConversations);
    
    // Create a map of userId -> messages
    const messagesMap: Record<string, Message[]> = {};
    mockMessages.forEach(message => {
      if (!messagesMap[message.conversationId]) {
        messagesMap[message.conversationId] = [];
      }
      messagesMap[message.conversationId].push({
        id: message.id,
        conversationId: message.conversationId,
        text: message.text,
        sender: message.sender,
        timestamp: message.timestamp
      });
    });
    setMessages(messagesMap);
  }, []);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conv => 
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current conversation
  const currentConversation = selectedUserId 
    ? conversations.find(conv => conv.id === selectedUserId)
    : undefined;

  // Get messages for current conversation
  const currentMessages = selectedUserId ? messages[selectedUserId] || [] : [];

  // Handle selecting a user
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    
    // Mark messages as read
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === userId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  // Handle sending a message
  const handleSendMessage = (text: string) => {
    if (!selectedUserId) return;
    
    const newMessage: Message = {
      id: uuidv4(),
      conversationId: selectedUserId,
      text,
      sender: 'self',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Add message to current conversation
    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedUserId]: [...(prevMessages[selectedUserId] || []), newMessage]
    }));
    
    // Update last message in conversation list
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === selectedUserId 
          ? { 
              ...conv, 
              lastMessage: text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            } 
          : conv
      )
    );
    
    // Simulate response after delay (for demo purposes)
    setTimeout(() => {
      const responseMessage: Message = {
        id: uuidv4(),
        conversationId: selectedUserId,
        text: `This is an automated response to "${text}"`,
        sender: 'other',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => ({
        ...prevMessages,
        [selectedUserId]: [...(prevMessages[selectedUserId] || []), responseMessage]
      }));
    }, 1000);
  };

  // Handle starting a new conversation
  const handleNewMessage = () => {
    // In a real app, this would open a dialog to select a user
    // For demo purposes, we'll just alert
    alert('New message feature would be implemented here');
  };

  return {
    conversations: filteredConversations,
    currentConversation,
    currentMessages,
    selectedUserId,
    searchQuery,
    setSearchQuery,
    handleSelectUser,
    handleSendMessage,
    handleNewMessage
  };
};

export default useMessages;