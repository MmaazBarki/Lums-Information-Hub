import React from 'react';
import { MenuItem, ListSubheader } from '@mui/material';

interface Department {
  value: string;
  label: string;
}

interface School {
  name: string;
  departments: Department[];
}

const schoolsData: School[] = [
  {
    name: 'Suleman Dawood School of Business (SDSB)',
    departments: [
      { value: 'ACCF', label: 'Accounting and Finance' },
      { value: 'MGMT', label: 'Management Science' },
      // Add more SDSB majors if needed
    ],
  },
  {
    name: 'Syed Babar Ali School of Science and Engineering (SSE)',
    departments: [
      { value: 'CS', label: 'Computer Science' },
      { value: 'EE', label: 'Electrical Engineering' },
      { value: 'MATH', label: 'Mathematics' },
      { value: 'PHY', label: 'Physics' },
      { value: 'CHEMBIO', label: 'Chemistry and Biology' },
      // Add more SSE majors if needed
    ],
  },
  {
    name: 'Mushtaq Ahmad Gurmani School of Humanities and Social Sciences (HSS)',
    departments: [
      { value: 'ECO', label: 'Economics' },
      { value: 'POL', label: 'Political Science' },
      { value: 'HIST', label: 'History' },
      { value: 'ANTHSOC', label: 'Anthropology and Sociology' },
      { value: 'ENG', label: 'English' },
      // Add more HSS majors if needed
    ],
  },
  {
    name: 'Shaikh Ahmad Hassan School of Law (SAHSOL)',
    departments: [
      { value: 'LAW', label: 'Law' },
      // Add more Law majors if needed
    ],
  },
  {
    name: 'Other',
    departments: [
        { value: 'OTHER', label: 'Other/Not Specified' },
    ]
  } // Added missing comma here
];

/**
 * Generates grouped options for the department Select component.
 * Returns an array of React nodes (ListSubheader and MenuItem).
 */
export const generateGroupedDepartmentOptions = (): React.ReactNode[] => { // Renamed function for clarity
  const options: React.ReactNode[] = [];
  schoolsData.forEach((school) => {
    // Add the school name as a subheader
    options.push(<ListSubheader key={school.name}>{school.name}</ListSubheader>);
    // Add the departments under that school
    school.departments.forEach((dept) => {
      options.push(
        <MenuItem key={dept.value} value={dept.value}>
          {dept.label}
        </MenuItem>
      );
    });
  });
  return options;
};

// Optional: Export the raw data if needed elsewhere
export const schools = schoolsData;