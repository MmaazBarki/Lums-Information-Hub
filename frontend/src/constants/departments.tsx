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
    ],
  },
  {
    name: 'Shaikh Ahmad Hassan School of Law (SAHSOL)',
    departments: [
      { value: 'LAW', label: 'Law' },
    ],
  },
  {
    name: 'Other',
    departments: [
        { value: 'OTHER', label: 'Other/Not Specified' },
    ]
  } 
];

export const generateGroupedDepartmentOptions = (): React.ReactNode[] => { // Renamed function for clarity
  const options: React.ReactNode[] = [];
  schoolsData.forEach((school) => {
    options.push(<ListSubheader key={school.name}>{school.name}</ListSubheader>);
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

export const schools = schoolsData;