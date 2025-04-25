import React, { useState, useEffect, useMemo } from 'react';
import { 
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  ListItemButton,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  CloudDownload as CloudDownloadIcon,
  Folder as FolderIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Close as CloseIcon,
  PersonOutline as PersonIcon,
  CalendarToday as CalendarIcon,
  FileCopy as FileIcon,
  Star as StarIcon,
} from '@mui/icons-material';

import { useAuth } from '../../../context/AuthContext';

interface Course {
  _id: string;
  course_code: string;
  course_name: string;
  description: string;
  department: string;
  credits: number;
  resourceCount: number;
}

interface AcademicResource {
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

const Courses: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<AcademicResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    topic: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [uploadLoading, setUploadLoading] = useState(false);

  const [currentUserRating, setCurrentUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false); 

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:5001/api/courses', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
 
  useEffect(() => {
    if (selectedCourse) {
      const fetchResources = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const response = await fetch(`http://localhost:5001/api/resources/${selectedCourse}`, {
            method: 'GET',
            credentials: 'include',
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch resources');
          }
          
          const data = await response.json();
          setResources(data);
        } catch (err) {
          console.error('Error fetching resources:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
        setResources([]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchResources();
    } else {
      setResources([]);
    }
  }, [selectedCourse]);

  useEffect(() => {
    const fetchBookmarkedResources = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/bookmarks', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch bookmarked resources');
        }
        
        const data = await response.json();
        const bookmarkIds = data.map((resource: AcademicResource) => resource._id);
        setBookmarkedResources(bookmarkIds);
      } catch (err) {
        console.error('Error fetching bookmarked resources:', err);
      }
    };
    
    if (user) {
      fetchBookmarkedResources();
    }
  }, [user]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => 
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, courses]);

  const courseResources = useMemo(() => {
    if (!selectedCourse) return [];
    return resources;
  }, [selectedCourse, resources]);

  const toggleBookmark = async (resourceId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/bookmarks/${resourceId}`, {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to toggle bookmark');
      }
      
      const data = await response.json();
      
      if (data.isBookmarked) {
        setBookmarkedResources(prev => [...prev, resourceId]);
      } else {
        setBookmarkedResources(prev => prev.filter(id => id !== resourceId));
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

  const handleOpenResourceModal = (resource: AcademicResource) => {
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
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadResource = async () => {
    if (!selectedCourse || !selectedFile) {
      alert("Please select a course and a file to upload.");
      return;
    }
    
    setUploadLoading(true);
    
    const formData = new FormData();
    formData.append('topic', uploadFormData.topic);
    formData.append('description', uploadFormData.description);
    formData.append('course_code', selectedCourse);
    formData.append('resourceFile', selectedFile); 

    try {
      const response = await fetch('http://localhost:5001/api/resources/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload resource');
      }
      
      const data = await response.json();
      
      setResources(prev => [...prev, data.resource]);
      
      setUploadDialogOpen(false);
      setUploadFormData({
        topic: '',
        description: '',
      });
      setSelectedFile(null); 
      
      alert('Resource uploaded successfully!');
    } catch (err) {
      console.error('Error uploading resource:', err);
      alert(err instanceof Error ? err.message : 'Failed to upload resource');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
        Academic Resources
      </Typography>
      
      <Paper
        elevation={3}
        sx={{ p: 2, mb: 3 }}
      >
        <TextField
          fullWidth
          placeholder="Search courses..."
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

      <Grid container spacing={2}>
        {/* Left panel - Course list */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: 'calc(100vh - 280px)', 
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: (theme) => 
                  theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
              },
            }}
          >
            <List component="nav" aria-label="courses list">
              <ListItem>
                <ListItemText 
                  primary={
                    <Typography variant="h6">Courses</Typography>
                  } 
                />
              </ListItem>
              <Divider />
              
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <ListItemButton 
                    key={course.course_code}
                    onClick={() => setSelectedCourse(course.course_code)}
                    selected={selectedCourse === course.course_code}
                  >
                    <ListItemIcon>
                      <SchoolIcon color={selectedCourse === course.course_code ? "primary" : "inherit"} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={course.course_code} 
                      secondary={course.course_name} 
                    />                      <Chip 
                      size="small" 
                      // Use the resourceCount from the fetched course data
                      label={course.resourceCount.toString()} 
                      color={selectedCourse === course.course_code ? "primary" : "default"}
                    />
                  </ListItemButton>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No courses found" 
                    secondary="Try a different search term" 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Right panel - Resources list or empty state */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper 
            elevation={3} 
            sx={{ 
              height: 'calc(100vh - 280px)', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {selectedCourse ? (
              <>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      {courses.find(c => c.course_code === selectedCourse)?.course_name} ({selectedCourse})
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<CloudDownloadIcon />}
                      size="small"
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload Resource
                    </Button>
                  </Box>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="resource tabs">
                    <Tab label="All Resources" />
                    <Tab label="Bookmarked" />
                  </Tabs>
                </Box>
                
                <Box sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto',
                  p: 2,
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                    borderRadius: '4px',
                  },
                }}>
                  {tabValue === 0 ? (
                    // All resources tab
                    courseResources.length > 0 ? (
                      <Grid container spacing={2}>
                        {courseResources.map((resource) => (
                          <Grid item xs={12} sm={6} md={4} key={resource._id}>
                            {/* Add relative positioning to the Card */}
                            <Card elevation={2} sx={{ position: 'relative' }}>
                              {/* Move IconButton outside CardActionArea */}
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
                                {bookmarkedResources.includes(resource._id) ? (
                                  <BookmarkAddedIcon color="primary" />
                                ) : (
                                  <BookmarkIcon />
                                )}
                              </IconButton>
                              <CardActionArea onClick={() => handleOpenResourceModal(resource)}>
                                <CardContent>
                                  {/* Remove the Box containing the IconButton */}
                                  <Typography variant="h6" noWrap sx={{ maxWidth: '80%', pr: 4 }}>
                                    {resource.topic}
                                  </Typography>
                                  
                                  {/* Display Average Rating */}
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
                                      {/* Display file type extension */}
                                      {resource.file_type?.toUpperCase() || 'FILE'}
                                    </Avatar>
                                    <Typography variant="body2" color="text.secondary">
                                      {/* Display formatted file size */}
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
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        p: 3,
                        textAlign: 'center'
                      }}>
                        <FolderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          No resources available for this course
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Be the first to upload study materials for {selectedCourse}
                        </Typography>
                        <Button 
                          variant="contained" 
                          startIcon={<CloudDownloadIcon />}
                          onClick={() => setUploadDialogOpen(true)}
                        >
                          Upload Resource
                        </Button>
                      </Box>
                    )
                  ) : (
                    // Bookmarked resources tab
                    courseResources.filter(r => bookmarkedResources.includes(r._id)).length > 0 ? (
                      <Grid container spacing={2}>
                        {courseResources
                          .filter(r => bookmarkedResources.includes(r._id))
                          .map((resource) => (
                            <Grid item xs={12} sm={6} md={4} key={resource._id}>
                              {/* Add relative positioning to the Card */}
                              <Card elevation={2} sx={{ position: 'relative' }}>
                                {/* Move IconButton outside CardActionArea */}
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
                                  {/* Always show filled icon in bookmarked tab */}
                                  <BookmarkAddedIcon color="primary" /> 
                                </IconButton>
                                <CardActionArea onClick={() => handleOpenResourceModal(resource)}>
                                  <CardContent>
                                    {/* Remove the Box containing the IconButton */}
                                    <Typography variant="h6" noWrap sx={{ maxWidth: '80%', pr: 4 /* Add padding to prevent overlap */ }}>
                                      {resource.topic}
                                    </Typography>
                                    
                                    {/* Display Average Rating */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
                                      <Rating 
                                        name={`rating-bookmark-${resource._id}`}
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
                                        {resource.file_type.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body2" color="text.secondary">
                                        {resource.file_type} • {resource.file_size}
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
                    ) : (
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        height: '100%',
                        p: 3,
                        textAlign: 'center'
                      }}>
                        <BookmarkIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          No bookmarked resources
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bookmark resources to save them for quick access
                        </Typography>
                      </Box>
                    )
                  )}
                </Box>
              </>
            ) : (
              <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                p: 3,
                textAlign: 'center'
              }}>
                <SchoolIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Select a course
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Choose a course from the list to view available academic resources
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

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
                      {/* Display formatted file size */}
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
                    
                    {/* Display Average Rating in Modal */}
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
                        variant={bookmarkedResources.includes(selectedResource._id) ? "outlined" : "text"}
                        startIcon={bookmarkedResources.includes(selectedResource._id) ? <BookmarkAddedIcon /> : <BookmarkIcon />}
                        onClick={() => toggleBookmark(selectedResource._id)}
                        color="primary"
                      >
                        {bookmarkedResources.includes(selectedResource._id) ? "Bookmarked" : "Bookmark"}
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
      
      {/* Upload Resource Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Upload Resource
          <IconButton
            aria-label="close"
            onClick={() => setUploadDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Topic"
              name="topic"
              value={uploadFormData.topic}
              onChange={handleUploadFormChange}
              fullWidth
              required
            />
            <TextField
              label="Description"
              name="description"
              value={uploadFormData.description}
              onChange={handleUploadFormChange}
              fullWidth
              multiline
              rows={4}
              required
            />
            {/* Replace text fields with a file input */}
            <Button
              variant="contained"
              component="label"
              fullWidth
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUploadResource} 
            variant="contained"
            disabled={uploadLoading}
          >
            {uploadLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Courses;