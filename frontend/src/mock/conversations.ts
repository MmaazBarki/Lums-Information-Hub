interface MockConversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export const conversations: MockConversation[] = [
  {
    id: '1',
    name: 'Ahmed Khan',
    lastMessage: 'I missed the lecture because I was sick',
    timestamp: '10:25 AM',
    unread: 2
  },
  {
    id: '2',
    name: 'Sara Ahmed',
    lastMessage: 'I submitted the assignment. Have you checked the feedback yet?',
    timestamp: 'Yesterday',
    unread: 0
  },
  {
    id: '3',
    name: 'Dr. Ali Raza',
    lastMessage: 'Your project proposal has been approved.',
    timestamp: 'Yesterday',
    unread: 1
  },
  {
    id: '4',
    name: 'Ibrahim Malik',
    lastMessage: 'Great, see you at the library at 4pm',
    timestamp: 'Monday',
    unread: 0
  },
  {
    id: '5',
    name: 'Ayesha Tariq',
    lastMessage: 'Works for me!',
    timestamp: 'Sunday',
    unread: 0
  },
  {
    id: '6',
    name: 'Study Group',
    lastMessage: 'Agreed. Those were emphasized in the review session too.',
    timestamp: 'Last week',
    unread: 3
  },
  {
    id: '7',
    name: 'Project Partner',
    lastMessage: 'Good idea. I\'ll prepare a demo of my part.',
    timestamp: '2 weeks ago',
    unread: 0
  },
  {
    id: '8',
    name: 'Class Rep',
    lastMessage: 'Tuesday and Thursday from 2-4pm.',
    timestamp: 'Mar 20',
    unread: 1
  },
  {
    id: '9',
    name: 'Library Staff',
    lastMessage: 'We also have a new collection of AI and Machine Learning books available now.',
    timestamp: 'Mar 15',
    unread: 0
  },
  {
    id: '10',
    name: 'Academic Advisor',
    lastMessage: 'Looking forward to it.',
    timestamp: 'Mar 10',
    unread: 2
  }
];