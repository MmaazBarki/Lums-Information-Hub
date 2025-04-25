import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';

interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    email?: string;
    profile_data?: {
      name?: string;
      department?: string;
    };
  };
  type: 'post' | 'message';
  content: string;
  referenceId: string;
  onModel: 'Post' | 'Message';
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {}
});

export const useNotifications = () => useContext(NotificationContext);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      
      const newSocket = io('http://localhost:5001', {
        query: { userId: user.id },
        transports: ['websocket', 'polling']
      });
      
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      
      setSocket(newSocket);

      return () => {
        console.log('Disconnecting socket');
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:5001/api/notifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch notifications');
      }

      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {
      
      setNotifications(prev => {
        const exists = prev.some(n => n._id === notification._id);
        if (exists) return prev;
        return [notification, ...prev];
      });
      
      setUnreadCount(prev => prev + 1);
    };

    const handleNotificationRead = (notificationId: string) => {
      
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      setNotifications(prev => {
        const wasUnread = prev.some(n => n._id === notificationId && !n.isRead);
        if (wasUnread) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return prev;
      });
    };

    const handleAllNotificationsRead = () => {
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('notificationReadUpdate', handleNotificationRead);
    socket.on('allNotificationsReadUpdate', handleAllNotificationsRead);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('notificationReadUpdate', handleNotificationRead);
      socket.off('allNotificationsReadUpdate', handleAllNotificationsRead);
    };
  }, [socket]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      
      const response = await fetch(`http://localhost:5001/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error when marking notification as read');
        throw new Error('You need to be logged in to mark notifications as read');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to mark notification as read');
      }
      
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      );
      
      const wasUnread = notifications.find(n => n._id === notificationId && !n.isRead);
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    if (unreadCount === 0) {
      return;
    }

    try {
      
      const response = await fetch('http://localhost:5001/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error when marking all notifications as read');
        throw new Error('You need to be logged in to mark notifications as read');
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to mark all notifications as read');
      }
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};