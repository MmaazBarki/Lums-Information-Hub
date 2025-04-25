import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Message } from '../types';
import { useAuth } from '../../../../context/AuthContext';

const API_URL = 'http://localhost:5001/api/message';
const SOCKET_URL = 'http://localhost:5001';

interface BackendUser {
  _id: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data?: { 
    name?: string;
    firstName?: string;
    avatar?: string;
  };
  alternate_email?: string;
  major?: string;
}

export const useMessages = () => {
  const { user: currentUser, loading: authLoading } = useAuth(); 
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;
    setLoadingUsers(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users`, {
        credentials: 'include', 
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
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
    if (!currentUser || !currentUser.id) {
      console.error("Cannot fetch messages: user not authenticated.");
      setError("Authentication required to fetch messages."); 
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
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && !socketRef.current) {
      const socket = io(SOCKET_URL, {
        query: { userId: currentUser.id },
      });
      socketRef.current = socket;

      console.log('Socket connected', socket.id);

      socket.on('newMessage', (newMessage: Message) => {
        console.log('Received new message via socket:', newMessage);
        const conversationPartnerId = newMessage.senderID === currentUser.id ? newMessage.receiverID : newMessage.senderID;
        setMessages(prev => ({
          ...prev,
          [conversationPartnerId]: [...(prev[conversationPartnerId] || []), newMessage],
        }));

        if (selectedUserId === conversationPartnerId) 
          {
        }
      });

      socket.on('getOnlineUsers', (users: string[]) => {
        console.log('Online users:', users);
        setOnlineUsers(users);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        console.log('Disconnecting socket...');
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [currentUser, selectedUserId]); 

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchUsers();
    }
  }, [authLoading, currentUser, fetchUsers]);

  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
    if (!messages[userId]) {
      fetchMessages(userId);
    }
  }, [messages, fetchMessages]);

  const handleSendMessage = useCallback(async (text: string, image?: string) => {
    if (!selectedUserId || !currentUser) return;

    const optimisticMessage: Message = {
      _id: `temp-${Date.now()}`,
      senderID: currentUser.id, 
      receiverID: selectedUserId, 
      text: text,
      image: image, 
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
        body: JSON.stringify({ text, image }), 
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const actualMessage: Message = await response.json();

      setMessages(prev => ({
        ...prev,
        [selectedUserId]: (prev[selectedUserId] || []).map(msg =>
          msg._id === optimisticMessage._id ? actualMessage : msg
        ),
      }));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      console.error("Error sending message:", err);

      setMessages(prev => ({
        ...prev,
        [selectedUserId]: (prev[selectedUserId] || []).filter(msg => msg._id !== optimisticMessage._id),
      }));
    }
  }, [selectedUserId, currentUser]);

  const currentConversationUser = selectedUserId
    ? users.find(u => u._id === selectedUserId)
    : undefined;

  const currentMessages = selectedUserId ? messages[selectedUserId] || [] : [];


  return {
    users, 
    currentConversationUser,
    currentMessages,
    selectedUserId,
    handleSelectUser,
    handleSendMessage,
    loading: loadingUsers || loadingMessages || authLoading,
    error,
    currentUserId: currentUser?.id,
    onlineUsers, 
  };
};

export default useMessages;