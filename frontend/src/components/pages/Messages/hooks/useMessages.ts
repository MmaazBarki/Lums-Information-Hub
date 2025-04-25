import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Message } from '../types'; // Use updated types
import { useAuth } from '../../../../context/AuthContext'; // Corrected import path

// Define backend API URL and Socket.IO server URL
const API_URL = 'http://localhost:5001/api/message';
const SOCKET_URL = 'http://localhost:5001';

// Define a type for the user object received from the backend
interface BackendUser {
  _id: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data?: { // profile_data is optional and can have various fields
    name?: string;
    firstName?: string;
    avatar?: string;
    // Add other potential fields from profile_data if known
  };
  // Add other fields from the backend User model if needed
  alternate_email?: string;
  major?: string;
  // etc.
}

export const useMessages = () => {
  const { user: currentUser, loading: authLoading } = useAuth(); // Get current user from AuthContext
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // --- API Fetching Functions ---
  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users`, {
        credentials: 'include', // Include cookies for authentication
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      // Explicitly type backendUser using the BackendUser interface
      setUsers(data.map((backendUser: BackendUser) => ({
        _id: backendUser._id, 
        email: backendUser.email,
        name: backendUser.profile_data?.name || backendUser.profile_data?.firstName || backendUser.email,
        avatar: backendUser.profile_data?.avatar || undefined, 
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [currentUser]);

  const fetchMessages = useCallback(async (userId: string) => {
    // Add check to ensure currentUser exists before fetching
    if (!currentUser || !currentUser.id) {
      console.error("Cannot fetch messages: user not authenticated.");
      setError("Authentication required to fetch messages."); // Optionally set an error state
      return; 
    }
    setLoadingMessages(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data: Message[] = await response.json();
      setMessages(prev => ({ ...prev, [userId]: data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(`Error fetching messages for user ${userId}:`, err);
    } finally {
      setLoadingMessages(false);
    }
  }, [currentUser]); // Keep currentUser in dependency array

  // --- Socket.IO Setup ---
  useEffect(() => {
    if (currentUser && !socketRef.current) {
      // Connect to Socket.IO server, passing userId in query
      const socket = io(SOCKET_URL, {
        query: { userId: currentUser.id },
      });
      socketRef.current = socket;

      console.log('Socket connected', socket.id);

      // Listen for new messages
      socket.on('newMessage', (newMessage: Message) => {
        console.log('Received new message via socket:', newMessage);
        // Add message to the correct conversation using senderID and receiverID
        const conversationPartnerId = newMessage.senderID === currentUser.id ? newMessage.receiverID : newMessage.senderID;
        setMessages(prev => ({
          ...prev,
          [conversationPartnerId]: [...(prev[conversationPartnerId] || []), newMessage],
        }));

        // If the message is for the currently selected user, update the view
        if (selectedUserId === conversationPartnerId) 
          {
          // Optionally mark as read or trigger UI updat
        }
      });

      // Listen for online users update
      socket.on('getOnlineUsers', (users: string[]) => {
        console.log('Online users:', users);
        setOnlineUsers(users);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      // Cleanup on component unmount or user change
      return () => {
        console.log('Disconnecting socket...');
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [currentUser, selectedUserId]); // Re-run if currentUser changes

  // --- Initial Data Load ---
  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUsers();
    }
  }, [authLoading, currentUser, fetchUsers]);

  // --- Event Handlers ---
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
    // Fetch messages if not already loaded or if needed
    if (!messages[userId]) {
      fetchMessages(userId);
    }
    // TODO: Mark messages as read (requires backend changes)
  }, [messages, fetchMessages]);

  const handleSendMessage = useCallback(async (text: string, image?: string) => {
    if (!selectedUserId || !currentUser) return;

    // Optimistic UI update using senderID and receiverID
    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      senderID: currentUser.id, // Use senderID
      receiverID: selectedUserId, // Use receiverID
      text: text,
      image: image, // Include image if provided
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), optimisticMessage],
    }));

    try {
      const response = await fetch(`${API_URL}/send/${selectedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, image }), // Send text and optional image
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const actualMessage: Message = await response.json();

      // Replace optimistic message with actual message from backend
      setMessages(prev => ({
        ...prev,
        [selectedUserId]: (prev[selectedUserId] || []).map(msg =>
          msg._id === optimisticMessage._id ? actualMessage : msg
        ),
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error("Error sending message:", err);
      // Revert optimistic update on error
      setMessages(prev => ({
        ...prev,
        [selectedUserId]: (prev[selectedUserId] || []).filter(msg => msg._id !== optimisticMessage._id),
      }));
    }
  }, [selectedUserId, currentUser]);

  // --- Derived State ---
  const currentConversationUser = selectedUserId
    ? users.find(u => u._id === selectedUserId)
    : undefined;

  const currentMessages = selectedUserId ? messages[selectedUserId] || [] : [];

  // Note: Search functionality is removed for simplicity in this integration example.
  // It can be added back by filtering the `users` state.

  return {
    users, // Use `users` instead of `conversations`
    currentConversationUser, // Provide the user object for the header
    currentMessages,
    selectedUserId,
    handleSelectUser,
    handleSendMessage,
    loading: loadingUsers || loadingMessages || authLoading, // Combined loading state
    error,
    currentUserId: currentUser?.id, // Pass current user ID for MessageList
    onlineUsers, // Pass online users list
    // searchQuery and setSearchQuery can be added back if needed
  };
};

export default useMessages;