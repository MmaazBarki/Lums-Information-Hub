import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper 
} from '@mui/material';
import UserManagement from './UserManagement';
import PostManagement from './PostManagement';
import ResourceManagement from './ResourceManagement';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
      style={{ height: 'calc(100% - 48px)', overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 3, height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const Admin: React.FC = () => {
  const [value, setValue] = useState(0);
  const { user } = useAuth();

  // Redirect non-admin users
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="admin dashboard tabs"
          >
            <Tab label="User Management" {...a11yProps(0)} />
            <Tab label="Post Management" {...a11yProps(1)} />
            <Tab label="Resource Management" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={value} index={0}>
          <UserManagement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PostManagement />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ResourceManagement />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default Admin;