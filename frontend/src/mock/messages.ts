// Mock data for messages
export const mockMessages = {
  '1': [
    { id: '1', text: 'Hi there, I had a question about the CS assignment', sender: 'other', timestamp: '10:15 AM' },
    { id: '2', text: 'Sure, what do you need help with?', sender: 'self', timestamp: '10:20 AM' },
    { id: '3', text: 'When is the assignment due? I can\'t find the deadline on LMS', sender: 'other', timestamp: '10:30 AM' },
    { id: '4', text: 'Let me check...', sender: 'self', timestamp: '10:32 AM' },
    { id: '5', text: 'It\'s due next Monday at 11:59 PM', sender: 'self', timestamp: '10:35 AM' },
    { id: '6', text: 'Thanks! I appreciate it', sender: 'other', timestamp: '10:36 AM' },
    { id: '7', text: 'No problem. Are you having trouble with any part of it?', sender: 'self', timestamp: '10:38 AM' },
    { id: '8', text: 'Actually yes, I\'m stuck on the last problem', sender: 'other', timestamp: '10:40 AM' },
    { id: '9', text: 'The one about implementing the sorting algorithm?', sender: 'self', timestamp: '10:42 AM' },
    { id: '10', text: 'Exactly! I\'m not sure how to optimize it', sender: 'other', timestamp: '10:45 AM' },
    { id: '11', text: 'I can help you with that. Do you want to meet in the CS lab later?', sender: 'self', timestamp: '10:47 AM' },
    { id: '12', text: 'That would be great! How about 2 PM?', sender: 'other', timestamp: '10:50 AM' },
    { id: '13', text: 'Works for me. See you then!', sender: 'self', timestamp: '10:52 AM' },
    { id: '14', text: 'Perfect, thanks again for your help', sender: 'other', timestamp: '10:55 AM' },
  ],
  '2': [
    { id: '1', text: 'Hi, do you have the notes from yesterday\'s lecture?', sender: 'other', timestamp: 'Yesterday 2:15 PM' },
    { id: '2', text: 'Yes, I\'ll share them with you', sender: 'self', timestamp: 'Yesterday 2:25 PM' },
    { id: '3', text: 'Thanks for sharing the notes!', sender: 'other', timestamp: 'Yesterday 3:05 PM' },
    { id: '4', text: 'You\'re welcome! Did they help?', sender: 'self', timestamp: 'Yesterday 3:30 PM' },
    { id: '5', text: 'Absolutely, they were very comprehensive', sender: 'other', timestamp: 'Yesterday 4:00 PM' },
    { id: '6', text: 'Glad to hear that. Let me know if you need anything else', sender: 'self', timestamp: 'Yesterday 4:15 PM' },
    { id: '7', text: 'Actually, do you have the slides as well?', sender: 'other', timestamp: 'Yesterday 4:30 PM' },
    { id: '8', text: 'Sure, I\'ll send those too', sender: 'self', timestamp: 'Yesterday 4:35 PM' },
    { id: '9', text: '[Slides attached]', sender: 'self', timestamp: 'Yesterday 4:40 PM' },
  ],
  '3': [
    { id: '1', text: 'Are you free tomorrow for the study group?', sender: 'other', timestamp: 'Yesterday 7:30 PM' },
    { id: '2', text: 'What time are you planning to meet?', sender: 'self', timestamp: 'Yesterday 8:00 PM' },
    { id: '3', text: 'Around 5pm at the library', sender: 'other', timestamp: 'Yesterday 8:15 PM' },
    { id: '4', text: 'Are you coming to the study group?', sender: 'other', timestamp: 'Yesterday 9:30 PM' },
    { id: '5', text: 'Yes, I\'ll be there!', sender: 'self', timestamp: 'Yesterday 9:45 PM' },
    { id: '6', text: 'Great! We\'ll be in the group study room on the 2nd floor', sender: 'other', timestamp: 'Yesterday 9:50 PM' },
    { id: '7', text: 'Sounds good. Should I bring anything?', sender: 'self', timestamp: 'Yesterday 9:55 PM' },
    { id: '8', text: 'Just your laptop and the textbook if you have it', sender: 'other', timestamp: 'Yesterday 10:00 PM' },
    { id: '9', text: 'Got it. See you tomorrow!', sender: 'self', timestamp: 'Yesterday 10:05 PM' },
  ],
  '4': [
    { id: '1', text: 'Hey, I need help with my programming assignment', sender: 'other', timestamp: 'Monday 11:00 AM' },
    { id: '2', text: 'What are you having trouble with?', sender: 'self', timestamp: 'Monday 11:15 AM' },
    { id: '3', text: 'I can\'t get my function to return the correct output', sender: 'other', timestamp: 'Monday 11:20 AM' },
    { id: '4', text: 'Can you share your code?', sender: 'self', timestamp: 'Monday 11:25 AM' },
    { id: '5', text: '[Code snippet attached]', sender: 'other', timestamp: 'Monday 11:30 AM' },
    { id: '6', text: 'I see the issue. You need to initialize your variable before the loop', sender: 'self', timestamp: 'Monday 11:40 AM' },
    { id: '7', text: 'Let me try that', sender: 'other', timestamp: 'Monday 11:45 AM' },
    { id: '8', text: 'It worked! Thanks for your help', sender: 'other', timestamp: 'Monday 12:00 PM' },
    { id: '9', text: 'Sure, I can help with that', sender: 'self', timestamp: 'Monday 12:05 PM' },
  ],
  '5': [
    { id: '1', text: 'Hi, I sent you an email about the project', sender: 'other', timestamp: 'Apr 1 9:00 AM' },
    { id: '2', text: 'Sorry, I haven\'t checked my email yet', sender: 'self', timestamp: 'Apr 1 9:30 AM' },
    { id: '3', text: 'No worries. It\'s about the presentation next week', sender: 'other', timestamp: 'Apr 1 9:35 AM' },
    { id: '4', text: 'I\'ll check it right away', sender: 'self', timestamp: 'Apr 1 9:40 AM' },
    { id: '5', text: 'Did you get my email?', sender: 'other', timestamp: 'Apr 1 4:00 PM' },
  ],
  '6': [
    { id: '1', text: 'Have you started working on the final project?', sender: 'other', timestamp: 'Mar 31 10:00 AM' },
    { id: '2', text: 'Not yet, I\'ve been busy with other assignments', sender: 'self', timestamp: 'Mar 31 10:30 AM' },
    { id: '3', text: 'We should get started soon', sender: 'other', timestamp: 'Mar 31 10:35 AM' },
    { id: '4', text: 'I agree. When are you free to discuss?', sender: 'self', timestamp: 'Mar 31 10:40 AM' },
    { id: '5', text: 'How about tomorrow afternoon?', sender: 'other', timestamp: 'Mar 31 10:45 AM' },
    { id: '6', text: 'That works for me', sender: 'self', timestamp: 'Mar 31 10:50 AM' },
    { id: '7', text: 'Great! Let\'s meet at the cafeteria at 2 PM', sender: 'other', timestamp: 'Mar 31 10:55 AM' },
    { id: '8', text: 'By the way, the project deadline is next Friday', sender: 'other', timestamp: 'Mar 31 11:00 AM' },
    { id: '9', text: 'Thanks for the reminder, I\'ll make sure to clear my schedule', sender: 'self', timestamp: 'Mar 31 11:05 AM' },
    { id: '10', text: 'We should also decide on the topic', sender: 'other', timestamp: 'Mar 31 11:10 AM' },
    { id: '11', text: 'I was thinking about machine learning applications', sender: 'self', timestamp: 'Mar 31 11:15 AM' },
    { id: '12', text: 'That sounds interesting!', sender: 'other', timestamp: 'Mar 31 11:20 AM' },
  ],
  '7': [
    { id: '1', text: 'Just wanted to let you know I submitted our assignment', sender: 'other', timestamp: 'Apr 2 5:00 PM' },
    { id: '2', text: 'Thanks! Did you get a confirmation?', sender: 'self', timestamp: 'Apr 2 5:10 PM' },
    { id: '3', text: 'Yes, got the email receipt', sender: 'other', timestamp: 'Apr 2 5:15 PM' },
    { id: '4', text: 'Perfect, thanks for handling that', sender: 'self', timestamp: 'Apr 2 5:20 PM' },
    { id: '5', text: 'No problem! I think we did well on this one', sender: 'other', timestamp: 'Apr 2 5:25 PM' },
    { id: '6', text: 'I\'ve submitted our group assignment', sender: 'other', timestamp: 'Apr 2 5:30 PM' },
  ],
  '9': [
    { id: '1', text: 'Do you have the course outline for CS 360?', sender: 'other', timestamp: 'Mar 25 3:00 PM' },
    { id: '2', text: 'Yes, I can share it with you', sender: 'self', timestamp: 'Mar 25 3:15 PM' },
    { id: '3', text: '[Document attached]', sender: 'self', timestamp: 'Mar 25 3:20 PM' },
    { id: '4', text: 'Thanks! Do you know when the midterm is?', sender: 'other', timestamp: 'Mar 25 3:30 PM' },
    { id: '5', text: 'It should be in Week 8, but the exact date isn\'t announced yet', sender: 'self', timestamp: 'Mar 25 3:35 PM' },
    { id: '6', text: 'Can you share the course outline?', sender: 'other', timestamp: 'Mar 25 4:00 PM' },
  ]
};

interface MockMessage {
  id: string;
  conversationId: string;
  text: string;
  sender: 'self' | 'other';
  timestamp: string;
}

export const messages: MockMessage[] = [
  // Conversation 1 - Ahmed Khan
  {
    id: '101',
    conversationId: '1',
    text: 'Hey, do you have the notes from yesterday\'s class?',
    sender: 'other',
    timestamp: '10:25 AM'
  },
  {
    id: '102',
    conversationId: '1',
    text: 'I missed the lecture because I was sick',
    sender: 'other',
    timestamp: '10:25 AM'
  },
  {
    id: '103',
    conversationId: '1',
    text: 'Sure, I can share them with you. Let me find them first.',
    sender: 'self',
    timestamp: '10:28 AM'
  },
  
  // Conversation 2 - Sara Ahmed
  {
    id: '201',
    conversationId: '2',
    text: 'Have you finished the assignment yet?',
    sender: 'other',
    timestamp: 'Yesterday'
  },
  {
    id: '202',
    conversationId: '2',
    text: 'Yes, I submitted it yesterday',
    sender: 'self',
    timestamp: 'Yesterday'
  },
  {
    id: '203',
    conversationId: '2',
    text: 'I submitted the assignment. Have you checked the feedback yet?',
    sender: 'other',
    timestamp: 'Yesterday'
  },
  
  // Conversation 3 - Dr. Ali Raza
  {
    id: '301',
    conversationId: '3',
    text: 'Hello Dr. Ali, I\'m writing to inquire about my project proposal.',
    sender: 'self',
    timestamp: 'Yesterday'
  },
  {
    id: '302',
    conversationId: '3',
    text: 'I submitted it last week but haven\'t heard back yet.',
    sender: 'self',
    timestamp: 'Yesterday'
  },
  {
    id: '303',
    conversationId: '3',
    text: 'Your project proposal has been approved.',
    sender: 'other',
    timestamp: 'Yesterday'
  },
  
  // Conversation 4 - Ibrahim Malik
  {
    id: '401',
    conversationId: '4',
    text: 'Are we still meeting to study for the exam?',
    sender: 'other',
    timestamp: 'Monday'
  },
  {
    id: '402',
    conversationId: '4',
    text: 'Yes, I\'ll be free after 3pm.',
    sender: 'self',
    timestamp: 'Monday'
  },
  {
    id: '403',
    conversationId: '4',
    text: 'Great, see you at the library at 4pm',
    sender: 'other',
    timestamp: 'Monday'
  },
  {
    id: '404',
    conversationId: '4',
    text: 'I\'ll bring my notes from last week\'s lecture as well.',
    sender: 'other',
    timestamp: 'Monday'
  },
  {
    id: '405',
    conversationId: '4',
    text: 'Perfect! I\'ll bring the practice exams.',
    sender: 'self',
    timestamp: 'Monday'
  },
  {
    id: '406',
    conversationId: '4',
    text: 'Do you think we should invite Ayesha as well?',
    sender: 'other',
    timestamp: 'Monday'
  },
  {
    id: '407',
    conversationId: '4',
    text: 'Yes, she\'s really good at explaining the complex topics.',
    sender: 'self',
    timestamp: 'Monday'
  },
  {
    id: '408',
    conversationId: '4',
    text: 'I\'ll message her now.',
    sender: 'other',
    timestamp: 'Monday'
  },
  {
    id: '409',
    conversationId: '4',
    text: 'She said she\'ll join us at 4:30pm after her lab.',
    sender: 'other',
    timestamp: 'Monday'
  },
  {
    id: '410',
    conversationId: '4',
    text: 'Great! The more the merrier.',
    sender: 'self',
    timestamp: 'Monday'
  },
  
  // Conversation 5 - Ayesha Tariq
  {
    id: '501',
    conversationId: '5',
    text: 'I found some great resources for our research project.',
    sender: 'self',
    timestamp: 'Sunday'
  },
  {
    id: '502',
    conversationId: '5',
    text: 'I\'ve shared the link with you.',
    sender: 'self',
    timestamp: 'Sunday'
  },
  {
    id: '503',
    conversationId: '5',
    text: 'Thanks for sharing the resources!',
    sender: 'other',
    timestamp: 'Sunday'
  },
  {
    id: '504',
    conversationId: '5',
    text: 'These are really helpful. Did you check the references section?',
    sender: 'other',
    timestamp: 'Sunday'
  },
  {
    id: '505',
    conversationId: '5',
    text: 'Yes, there are some great papers cited there.',
    sender: 'self',
    timestamp: 'Sunday'
  },
  {
    id: '506',
    conversationId: '5',
    text: 'I think we should focus on the methodology described in the third paper.',
    sender: 'other',
    timestamp: 'Sunday'
  },
  {
    id: '507',
    conversationId: '5',
    text: 'I agree. Their approach seems most relevant to our topic.',
    sender: 'self',
    timestamp: 'Sunday'
  },
  {
    id: '508',
    conversationId: '5',
    text: 'When do you want to meet to discuss the implementation?',
    sender: 'other',
    timestamp: 'Sunday'
  },
  {
    id: '509',
    conversationId: '5',
    text: 'How about Wednesday after class?',
    sender: 'self',
    timestamp: 'Sunday'
  },
  {
    id: '510',
    conversationId: '5',
    text: 'Works for me!',
    sender: 'other',
    timestamp: 'Sunday'
  },
  
  // Conversation 6 - Study Group
  {
    id: '601',
    conversationId: '6',
    text: 'Is everyone ready for the midterm next week?',
    sender: 'other',
    timestamp: 'Last week'
  },
  {
    id: '602',
    conversationId: '6',
    text: 'I\'m still reviewing the material from weeks 3-5.',
    sender: 'self',
    timestamp: 'Last week'
  },
  {
    id: '603',
    conversationId: '6',
    text: 'I found some old exams that might help us prepare.',
    sender: 'other',
    timestamp: 'Last week'
  },
  {
    id: '604',
    conversationId: '6',
    text: 'Could you share them with the group?',
    sender: 'self',
    timestamp: 'Last week'
  },
  {
    id: '605',
    conversationId: '6',
    text: 'Just sent them via email to everyone.',
    sender: 'other',
    timestamp: 'Last week'
  },
  {
    id: '606',
    conversationId: '6',
    text: 'Thanks! These will be very helpful.',
    sender: 'self',
    timestamp: 'Last week'
  },
  {
    id: '607',
    conversationId: '6',
    text: 'I suggest we focus on chapters 4 and 7, they\'re usually heavily tested.',
    sender: 'other',
    timestamp: 'Last week'
  },
  {
    id: '608',
    conversationId: '6',
    text: 'Agreed. Those were emphasized in the review session too.',
    sender: 'self',
    timestamp: 'Last week'
  },
  
  // Conversation 7 - Project Partner
  {
    id: '701',
    conversationId: '7',
    text: 'How\'s your part of the project coming along?',
    sender: 'other',
    timestamp: '2 weeks ago'
  },
  {
    id: '702',
    conversationId: '7',
    text: 'I\'ve completed about 70% of my tasks.',
    sender: 'self',
    timestamp: '2 weeks ago'
  },
  {
    id: '703',
    conversationId: '7',
    text: 'Great! I\'m almost done with mine.',
    sender: 'other',
    timestamp: '2 weeks ago'
  },
  {
    id: '704',
    conversationId: '7',
    text: 'We should integrate our code this weekend.',
    sender: 'self',
    timestamp: '2 weeks ago'
  },
  {
    id: '705',
    conversationId: '7',
    text: 'Sounds good. Are you free on Saturday?',
    sender: 'other',
    timestamp: '2 weeks ago'
  },
  {
    id: '706',
    conversationId: '7',
    text: 'Yes, anytime after 2pm works for me.',
    sender: 'self',
    timestamp: '2 weeks ago'
  },
  {
    id: '707',
    conversationId: '7',
    text: 'Perfect! Let\'s meet at the CS lab at 3pm.',
    sender: 'other',
    timestamp: '2 weeks ago'
  },
  {
    id: '708',
    conversationId: '7',
    text: 'I\'ll bring the project requirements so we can make sure we\'re on track.',
    sender: 'self',
    timestamp: '2 weeks ago'
  },
  {
    id: '709',
    conversationId: '7',
    text: 'Good idea. I\'ll prepare a demo of my part.',
    sender: 'other',
    timestamp: '2 weeks ago'
  },
  
  // Conversation 8 - Class Rep
  {
    id: '801',
    conversationId: '8',
    text: 'The professor has rescheduled tomorrow\'s class to 3pm.',
    sender: 'other',
    timestamp: 'Mar 20'
  },
  {
    id: '802',
    conversationId: '8',
    text: 'Thanks for letting me know!',
    sender: 'self',
    timestamp: 'Mar 20'
  },
  {
    id: '803',
    conversationId: '8',
    text: 'Also, the assignment deadline has been extended by two days.',
    sender: 'other',
    timestamp: 'Mar 20'
  },
  {
    id: '804',
    conversationId: '8',
    text: 'That\'s great news! I could use the extra time.',
    sender: 'self',
    timestamp: 'Mar 20'
  },
  {
    id: '805',
    conversationId: '8',
    text: 'The professor will also hold extra office hours this week.',
    sender: 'other',
    timestamp: 'Mar 20'
  },
  {
    id: '806',
    conversationId: '8',
    text: 'When are they?',
    sender: 'self',
    timestamp: 'Mar 20'
  },
  {
    id: '807',
    conversationId: '8',
    text: 'Tuesday and Thursday from 2-4pm.',
    sender: 'other',
    timestamp: 'Mar 20'
  },
  {
    id: '808',
    conversationId: '8',
    text: 'Perfect, I\'ll try to attend on Thursday.',
    sender: 'self',
    timestamp: 'Mar 20'
  },
  
  // Conversation 9 - Library Staff
  {
    id: '901',
    conversationId: '9',
    text: 'This is a reminder that you have 3 books due tomorrow.',
    sender: 'other',
    timestamp: 'Mar 15'
  },
  {
    id: '902',
    conversationId: '9',
    text: 'Thank you for the reminder. I\'ll return them this afternoon.',
    sender: 'self',
    timestamp: 'Mar 15'
  },
  {
    id: '903',
    conversationId: '9',
    text: 'Would you like to renew any of them?',
    sender: 'other',
    timestamp: 'Mar 15'
  },
  {
    id: '904',
    conversationId: '9',
    text: 'Yes, I\'d like to renew "Data Structures and Algorithms" if possible.',
    sender: 'self',
    timestamp: 'Mar 15'
  },
  {
    id: '905',
    conversationId: '9',
    text: 'I\'ve renewed it for you. It\'s now due in two weeks.',
    sender: 'other',
    timestamp: 'Mar 15'
  },
  {
    id: '906',
    conversationId: '9',
    text: 'Perfect, thank you!',
    sender: 'self',
    timestamp: 'Mar 15'
  },
  {
    id: '907',
    conversationId: '9',
    text: 'We also have a new collection of AI and Machine Learning books available now.',
    sender: 'other',
    timestamp: 'Mar 15'
  },
  {
    id: '908',
    conversationId: '9',
    text: 'That sounds interesting! I\'ll check them out when I come in.',
    sender: 'self',
    timestamp: 'Mar 15'
  },
  
  // Conversation 10 - Academic Advisor
  {
    id: '1001',
    conversationId: '10',
    text: 'I\'d like to schedule an appointment to discuss my course selection for next semester.',
    sender: 'self',
    timestamp: 'Mar 10'
  },
  {
    id: '1002',
    conversationId: '10',
    text: 'I have openings this Thursday between 10am and 2pm.',
    sender: 'other',
    timestamp: 'Mar 10'
  },
  {
    id: '1003',
    conversationId: '10',
    text: 'Can I book the 11am slot?',
    sender: 'self',
    timestamp: 'Mar 10'
  },
  {
    id: '1004',
    conversationId: '10',
    text: 'That works. I\'ve scheduled you for Thursday at 11am.',
    sender: 'other',
    timestamp: 'Mar 10'
  },
  {
    id: '1005',
    conversationId: '10',
    text: 'Thank you! Should I bring anything specific?',
    sender: 'self',
    timestamp: 'Mar 10'
  },
  {
    id: '1006',
    conversationId: '10',
    text: 'Please bring your transcript and a list of courses you\'re interested in taking.',
    sender: 'other',
    timestamp: 'Mar 10'
  },
  {
    id: '1007',
    conversationId: '10',
    text: 'Will do. See you on Thursday!',
    sender: 'self',
    timestamp: 'Mar 10'
  },
  {
    id: '1008',
    conversationId: '10',
    text: 'Looking forward to it.',
    sender: 'other',
    timestamp: 'Mar 10'
  }
];