import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Chip,
  Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../../context/AuthContext';

interface AcademicResource {
  _id: string;
  title: string;
  description: string;
  resourceUrl: string;
  fileType: string;
  uploadedBy: {
    _id: string;
    email: string;
  };
  courseId?: string;
  courseName?: string;
  created_at: string; 
  updated_at: string;
  tags?: string[];
}

const ResourceManagement: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<AcademicResource | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/resources/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch academic resources');
      }

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setResources(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.resources)) {
        setResources(data.resources);
      } else {
        console.error('Unexpected API response format:', data);
        setResources([]);
        setError('Received invalid data format from server');
      }
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/admin/delete/resources/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      setResources(resources.filter(resource => resource._id !== resourceId));
      setSnackbar({
        open: true,
        message: 'Resource deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to delete resource',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (resource: AcademicResource) => {
    setResourceToDelete(resource);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      deleteResource(resourceToDelete._id);
      setDeleteDialogOpen(false);
      setResourceToDelete(null);
    }
  };

  const handleCloseDialog = () => {
    setDeleteDialogOpen(false);
    setResourceToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatDescription = (description: string) => {
    return description && description.length > 100 ? `${description.substring(0, 100)}...` : description || '';
  };

  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Academic Resource Management
      </Typography>
      
      {resources.length === 0 ? (
        <Box sx={{ p: 3 }}>
          <Alert severity="info">No academic resources found</Alert>
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            mt: 3, 
            maxHeight: 'calc(100vh - 240px)', 
            overflow: 'auto'
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>File Type</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource._id}>
                  <TableCell>
                    <Link href={resource.resourceUrl} target="_blank" rel="noopener noreferrer">
                      {resource.title}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDescription(resource.description)}</TableCell>
                  <TableCell>{resource.fileType?.toUpperCase() || 'Unknown'}</TableCell>
                  <TableCell>{resource.uploadedBy?.email || 'Unknown'}</TableCell>
                  <TableCell>{resource.courseName || 'General'}</TableCell>
                  <TableCell>
                    {resource.created_at ? new Date(resource.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteClick(resource)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Academic Resource</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the resource "{resourceToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResourceManagement;