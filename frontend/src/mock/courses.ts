export interface Course {
  course_code: string;
  course_name: string;
  department?: string;
  credits?: number;
  description?: string;
}

export const mockCourses: Course[] = [
  {
    course_code: 'CS 100',
    course_name: 'Introduction to Programming',
    department: 'Computer Science',
    credits: 3,
    description: 'An introductory course to programming concepts and practices.'
  },
  {
    course_code: 'CS 200',
    course_name: 'Data Structures and Algorithms',
    department: 'Computer Science',
    credits: 3,
    description: 'Study of fundamental data structures and algorithms.'
  },
  {
    course_code: 'CS 300',
    course_name: 'Object-Oriented Programming',
    department: 'Computer Science',
    credits: 3,
    description: 'Advanced programming techniques using the object-oriented paradigm.'
  },
  {
    course_code: 'CS 310',
    course_name: 'Database Systems',
    department: 'Computer Science',
    credits: 3,
    description: 'Design, implementation and application of database management systems.'
  },
  {
    course_code: 'CS 360',
    course_name: 'Software Engineering',
    department: 'Computer Science',
    credits: 4,
    description: 'Principles and practices of software development and project management.'
  },
  {
    course_code: 'CS 370',
    course_name: 'Operating Systems',
    department: 'Computer Science',
    credits: 3,
    description: 'Fundamentals of operating system design and implementation.'
  },
  {
    course_code: 'CS 400',
    course_name: 'Computer Networks',
    department: 'Computer Science',
    credits: 3,
    description: 'Introduction to computer networks and protocols.'
  },
  {
    course_code: 'CS 440',
    course_name: 'Artificial Intelligence',
    department: 'Computer Science',
    credits: 3,
    description: 'Introduction to principles and applications of artificial intelligence.'
  },
  {
    course_code: 'CS 450',
    course_name: 'Machine Learning',
    department: 'Computer Science',
    credits: 3,
    description: 'Theory and implementation of machine learning algorithms.'
  },
  {
    course_code: 'CS 460',
    course_name: 'Computer Graphics',
    department: 'Computer Science',
    credits: 3,
    description: 'Theory and practice of computer graphics and visualization.'
  },
  {
    course_code: 'CS 470',
    course_name: 'Information Security',
    department: 'Computer Science',
    credits: 3,
    description: 'Principles and practices of information security and cryptography.'
  },
  {
    course_code: 'MATH 101',
    course_name: 'Calculus I',
    department: 'Mathematics',
    credits: 3,
    description: 'Introduction to differential and integral calculus.'
  },
  {
    course_code: 'MATH 102',
    course_name: 'Calculus II',
    department: 'Mathematics',
    credits: 3,
    description: 'Advanced topics in calculus including series and multivariable calculus.'
  },
  {
    course_code: 'MATH 201',
    course_name: 'Linear Algebra',
    department: 'Mathematics',
    credits: 3,
    description: 'Study of vector spaces, linear transformations, and matrices.'
  },
  {
    course_code: 'STATS 201',
    course_name: 'Probability and Statistics',
    department: 'Statistics',
    credits: 3,
    description: 'Introduction to probability theory and statistical methods.'
  },
  {
    course_code: 'EE 100',
    course_name: 'Intro to Electrical Engineering',
    department: 'Electrical Engineering',
    credits: 3,
    description: 'Fundamentals of electrical circuits and systems.'
  },
  {
    course_code: 'EE 200',
    course_name: 'Digital Logic Design',
    department: 'Electrical Engineering',
    credits: 3,
    description: 'Design and analysis of digital logic circuits.'
  },
  {
    course_code: 'PHY 101',
    course_name: 'Physics I',
    department: 'Physics',
    credits: 3,
    description: 'Introduction to classical mechanics and thermodynamics.'
  },
  {
    course_code: 'CHEM 101',
    course_name: 'General Chemistry',
    department: 'Chemistry',
    credits: 3,
    description: 'Principles of atomic and molecular structure, chemical bonding, and reactions.'
  },
  {
    course_code: 'BIO 101',
    course_name: 'Introduction to Biology',
    department: 'Biology',
    credits: 3,
    description: 'Basic principles of biology including cell structure, genetics, and evolution.'
  }
];