import React, { useState, useMemo } from 'react';
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
  // Tooltip,
  Avatar,
  Tabs,
  Tab,
  ListItemButton
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  // Description as DescriptionIcon,
  CloudDownload as CloudDownloadIcon,
  Folder as FolderIcon,
  BookmarkBorder as BookmarkIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Close as CloseIcon,
  PersonOutline as PersonIcon,
  CalendarToday as CalendarIcon,
  FileCopy as FileIcon
} from '@mui/icons-material';

import { mockCourses } from '../../../mock/courses';
import { mockAcademicResources, AcademicResource } from '../../../mock/academicResources';

const Courses: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<AcademicResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);

  // Filter courses based on search query
  const filteredCourses = useMemo(() => {
    return mockCourses.filter(course => 
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get resources for the selected course
  const courseResources = useMemo(() => {
    if (!selectedCourse) return [];
    return mockAcademicResources.filter(resource => resource.course_code === selectedCourse);
  }, [selectedCourse]);

  // Toggle bookmark for a resource
  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId)
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle opening the resource details modal
  const handleOpenResourceModal = (resource: AcademicResource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  // Handle closing the resource details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  // Handle download action (mock functionality)
  const handleDownload = () => {
    if (selectedResource) {
      console.log(`Downloading: ${selectedResource.file_url}`);
      // In a real app, this would trigger the file download
      alert(`Download started for: ${selectedResource.topic}`);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
                    />
                    <Chip 
                      size="small" 
                      label={mockAcademicResources.filter(r => r.course_code === course.course_code).length.toString()} 
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
                      {mockCourses.find(c => c.course_code === selectedCourse)?.course_name} ({selectedCourse})
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<CloudDownloadIcon />}
                      size="small"
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
                            <Card elevation={2}>
                              <CardActionArea onClick={() => handleOpenResourceModal(resource)}>
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                                      {resource.topic}
                                    </Typography>
                                    <IconButton 
                                      size="small" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(resource._id);
                                      }}
                                    >
                                      {bookmarkedResources.includes(resource._id) ? (
                                        <BookmarkAddedIcon color="primary" />
                                      ) : (
                                        <BookmarkIcon />
                                      )}
                                    </IconButton>
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
                              <Card elevation={2}>
                                <CardActionArea onClick={() => handleOpenResourceModal(resource)}>
                                  <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
                                        {resource.topic}
                                      </Typography>
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleBookmark(resource._id);
                                        }}
                                      >
                                        <BookmarkAddedIcon color="primary" />
                                      </IconButton>
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
                      File Type: <Chip label={selectedResource.file_type} size="small" />
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CloudDownloadIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="body2">
                      File Size: {selectedResource.file_size}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CloudDownloadIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="body2">
                      Downloads: {selectedResource.downloads}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Resource Information</Typography>
                    
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
    </Box>
  );
};

export default Courses;