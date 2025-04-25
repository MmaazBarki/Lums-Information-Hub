import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid,
  Card, 
  CardContent, 
  CardActionArea,
  IconButton,
  Avatar,
  Rating,
  Paper,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  BookmarkAdded as BookmarkAddedIcon,
  BookmarkBorder as BookmarkIcon,
  CloudDownload as CloudDownloadIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  PersonOutline as PersonIcon,
  CalendarToday as CalendarIcon,
  FileCopy as FileIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

interface BookmarkedResource {
  _id: string;
  uploader_id: string;
  uploader_name: string;
  course_code: string;
  topic: string;
  original_filename: string; 
  file_url: string;
  file_type: string; 
  file_size: number; 
  description: string;
  downloads: number;
  uploaded_at: string;
  averageRating: number;
  numberOfRatings: number;
  userRating?: number;
}

const BookmarkedResources: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<BookmarkedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<BookmarkedResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserRating, setCurrentUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    const fetchBookmarkedResources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5001/api/bookmarks', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarked resources');
        }
        
        const data = await response.json();
        setResources(data);
      } catch (err) {
        console.error('Error fetching bookmarked resources:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchBookmarkedResources();
    }
  }, [user]);

  const filteredResources = resources.filter(resource => 
    resource.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBookmark = async (resourceId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookmarks/${resourceId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }
      
      setResources(prev => prev.filter(resource => resource._id !== resourceId));
      
      if (selectedResource && selectedResource._id === resourceId) {
        setIsModalOpen(false);
        setSelectedResource(null);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleOpenResourceModal = (resource: BookmarkedResource) => {
    setSelectedResource(resource);
    setCurrentUserRating(resource.userRating || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
    setCurrentUserRating(null);
  };

  const handleDownload = async () => {
    if (selectedResource) {
      const resourceId = selectedResource._id;
      try {
        const response = await fetch(selectedResource.file_url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = selectedResource.original_filename;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);

        try {
          const downloadCountResponse = await fetch(`http://localhost:5001/api/resources/${resourceId}/download`, {
            method: 'POST',
            credentials: 'include',
          });
          if (!downloadCountResponse.ok) {
            console.error('Failed to update download count on backend:', await downloadCountResponse.text());
          } else {
            setResources(prevResources =>
              prevResources.map(resource =>
                resource._id === resourceId
                  ? { ...resource, downloads: resource.downloads + 1 }
                  : resource
              )
            );
            setSelectedResource(prevSelected => 
              prevSelected && prevSelected._id === resourceId 
                ? { ...prevSelected, downloads: prevSelected.downloads + 1 } 
                : prevSelected
            );
          }
        } catch (countError) {
          console.error('Error updating download count:', countError);
        }

      } catch (err) {
        console.error('Error during download:', err);
        alert('Failed to download the file.');
      }
    }
  };

  const handleRatingChange = async (newValue: number | null) => {
    if (!selectedResource || newValue === null || ratingLoading) return;

    setRatingLoading(true);
    setCurrentUserRating(newValue); 

    try {
      const response = await fetch(`http://localhost:5001/api/resources/${selectedResource._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ rating: newValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating');
      }

      const data = await response.json();

      const updatedResource = { 
        ...selectedResource, 
        averageRating: data.averageRating, 
        numberOfRatings: data.numberOfRatings,
        userRating: newValue
      };
      
      setSelectedResource(updatedResource);
      setResources(prevResources =>
        prevResources.map(resource =>
          resource._id === selectedResource._id
            ? updatedResource
            : resource
        )
      );

    } catch (err) {
      console.error('Error submitting rating:', err);
      alert(err instanceof Error ? err.message : 'Failed to submit rating');
      if (selectedResource) {
        setCurrentUserRating(selectedResource.userRating || null); 
      }
    } finally {
      setRatingLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bookmarked Resources
      </Typography>
      
      <Paper
        elevation={3}
        sx={{ p: 2, mb: 3 }}
      >
        <TextField
          fullWidth
          placeholder="Search in your bookmarked resources..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          minHeight: '400px'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography color="error" variant="h6">
              {error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please try again later.
            </Typography>
          </Box>
        ) : filteredResources.length === 0 ? (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '400px',
              textAlign: 'center'
            }}
          >
            <BookmarkIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            {searchQuery ? (
              <>
                <Typography variant="h6" gutterBottom>
                  No matching resources found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search term or clear the search
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  You don't have any bookmarked resources yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse courses and bookmark resources to save them for quick access
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                {filteredResources.length} {filteredResources.length === 1 ? 'Resource' : 'Resources'}
              </Typography>
              <Divider />
            </Box>
            <Grid container spacing={2}>
              {filteredResources.map((resource) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={resource._id}>
                  <Card elevation={2} sx={{ position: 'relative', height: '100%' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(resource._id);
                      }}
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8, 
                        zIndex: 1
                      }}
                    >
                      <BookmarkAddedIcon color="primary" />
                    </IconButton>
                    <CardActionArea 
                      onClick={() => handleOpenResourceModal(resource)}
                      sx={{ height: '100%' }}
                    >
                      <CardContent>
                        <Typography variant="h6" noWrap sx={{ maxWidth: '80%', pr: 4 }}>
                          {resource.topic}
                        </Typography>
                        
                        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                          {resource.course_code}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                          <Rating 
                            name={`rating-${resource._id}`}
                            value={resource.averageRating} 
                            precision={0.5} 
                            readOnly 
                            size="small"
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({resource.numberOfRatings})
                          </Typography>
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 28, height: 28, fontSize: '0.8rem' }}>
                            {resource.file_type?.toUpperCase() || 'FILE'}
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {resource.file_type?.toUpperCase()} • {formatFileSize(resource.file_size)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(resource.uploaded_at)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CloudDownloadIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                              {resource.downloads}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>

      {/* Resource Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '60vh'
          }
        }}
      >
        {selectedResource && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedResource.topic}</Typography>
                <IconButton onClick={handleCloseModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom>Description</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedResource.description || 'No description provided.'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>File Details</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FileIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="body2">
                      File Type: <Chip label={selectedResource.file_type?.toUpperCase()} size="small" />
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CloudDownloadIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="body2">
                      File Size: {formatFileSize(selectedResource.file_size)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CloudDownloadIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="body2">
                      Downloads: {selectedResource.downloads}
                    </Typography>
                  </Box>

                  {/* Add Rating Section */}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>Rate this Resource</Typography>
                  <Rating
                    name="user-rating"
                    value={currentUserRating}
                    onChange={(_event, newValue) => {
                      handleRatingChange(newValue);
                    }}
                    precision={1}
                    size="large"
                    disabled={ratingLoading}
                  />
                  {ratingLoading && <Typography variant="caption" sx={{ ml: 1 }}>Submitting...</Typography>}
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Resource Information</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
                      <Rating 
                        name={`rating-modal-${selectedResource._id}`}
                        value={selectedResource.averageRating} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({selectedResource.numberOfRatings} ratings)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1 }} fontSize="small" color="primary" />
                      <Typography variant="body2">
                        Uploaded by: {selectedResource.uploader_name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ mr: 1 }} fontSize="small" color="primary" />
                      <Typography variant="body2">
                        Course: {selectedResource.course_code}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1 }} fontSize="small" color="primary" />
                      <Typography variant="body2">
                        Uploaded on: {formatDate(selectedResource.uploaded_at)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 3 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<CloudDownloadIcon />}
                        onClick={handleDownload}
                      >
                        Download
                      </Button>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<BookmarkAddedIcon />}
                        onClick={() => toggleBookmark(selectedResource._id)}
                        color="primary"
                      >
                        Bookmarked
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Close
              </Button>
              <Button 
                variant="contained" 
                startIcon={<CloudDownloadIcon />}
                onClick={handleDownload}
                color="primary"
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default BookmarkedResources;