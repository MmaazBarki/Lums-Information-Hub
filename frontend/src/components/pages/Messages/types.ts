export interface User {
  _id: string; 
  email: string; 
  name: string; 
  avatar?: string;
}

export interface Conversation {
  id: string; 
  name: string;
  avatar?: string;
  lastMessage?: string; 
  timestamp?: string; 
  unread?: number; 
}

export interface Message {
  _id: string; 
  senderID: string;
  receiverID: string;
  text?: string; 
  image?: string; 
  createdAt: string; 
}

export interface MessageInputProps {
  onSendMessage: (text: string, image?: string) => void; 
}

export interface ConversationListProps {
  conversations: User[]; 
  selectedConversationId: string | null;
  onSelectConversation: (userId: string) => void; 
  onlineUsers?: string[]; 
  currentUserId: string; 
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string; 
}

export interface ConversationHeaderProps {
  conversation: User | null;
}

export interface EmptyStateProps {
  message?: string;
}