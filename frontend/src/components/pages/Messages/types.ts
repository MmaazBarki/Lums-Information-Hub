export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  sender: 'self' | 'other';
  timestamp: string;
}

export interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: Omit<Message, 'id'>) => void;
}

export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
}

export interface MessageListProps {
  messages: Message[];
}

export interface ConversationHeaderProps {
  conversation: Conversation | null;
}

export interface EmptyStateProps {
  message?: string;
}