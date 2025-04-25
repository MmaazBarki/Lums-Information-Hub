export interface User {
  _id: string; // Changed from id to _id to match backend
  email: string; // Added email, assuming it's available from user list endpoint
  name: string; // Assuming name is derived or available (e.g., from profile_data)
  avatar?: string;
  // Add other fields from backend User model if needed
}

export interface Conversation {
  id: string; // This will likely be the other user's _id
  name: string;
  avatar?: string;
  lastMessage?: string; // Make optional as it might not exist initially
  timestamp?: string; // Make optional
  unread?: number; // Make optional
}

export interface Message {
  _id: string; 
  senderID: string; // Changed back from senderId
  receiverID: string; // Changed back from receiverId
  text?: string; 
  image?: string; 
  createdAt: string; 
}

// No changes needed for these interfaces based on backend integration yet
export interface MessageInputProps {
  // conversationId: string; // Removed
  onSendMessage: (text: string, image?: string) => void; // Keep updated signature
}

export interface ConversationListProps {
  conversations: User[]; // Changed from Conversation[]
  selectedConversationId: string | null;
  onSelectConversation: (userId: string) => void; // Changed parameter name
  onlineUsers?: string[]; // Added optional onlineUsers prop
  currentUserId: string; // Added currentUserId to filter self
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string; // Prop already added in previous step
}

export interface ConversationHeaderProps {
  conversation: User | null; // Changed from Conversation | null
}

export interface EmptyStateProps {
  message?: string; // Changed to accept an optional message string
}