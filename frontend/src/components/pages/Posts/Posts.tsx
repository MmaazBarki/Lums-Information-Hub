import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    IconButton,
    CircularProgress,
    List,
    ListItem,
    Avatar,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Pagination,
    Stack
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';
import { generateGroupedDepartmentOptions, schools } from '../../../constants/departments';

interface Post {
    _id: string;
    title: string;
    name: string;
    email: string;
    description: string;
    department?: string;
    role?: string;
    category: string;
    number_of_likes: number;
    created_at: string;
    isLikedByCurrentUser?: boolean;
    likes?: string[];
}

const postCategories = ['Job Post', 'Internship Post', 'Community Post'];

const Posts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [description, setDescription] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [newPostCategory, setNewPostCategory] = useState<string>('Community Post'); 
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All'); 
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [viewedPost, setViewedPost] = useState<Post | null>(null);
    const [paginationMode, setPaginationMode] = useState<'scroll' | 'pagination'>('scroll');

    const observer = useRef<IntersectionObserver | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const lastPostElementRef = useCallback((node: HTMLLIElement | null) => {
        if (paginationMode !== 'scroll') return;
        if (loading || loadingMore) {
            return;
        }
        if (observer.current) observer.current.disconnect();

        if (!scrollContainerRef.current) {
            return;
        }

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setCurrentPage(prevPage => prevPage + 1);
            }
        }, {
            root: scrollContainerRef.current,
            rootMargin: '0px 0px 200px 0px',
            threshold: 0
        });

        if (node) {
            observer.current.observe(node);
        }
    }, [loading, loadingMore, hasMore, paginationMode]);

    useEffect(() => {
        console.log('Posts component mounted/refreshed');
        return () => {
            console.log('Posts component unmounted');
        };
    }, []);

    const fetchPosts = useCallback(async (page: number, department: string, category: string = 'All', loadMore = false) => {
        if (!loadMore) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);
        try {
            const categoryParam = category !== 'All' ? `&category=${category}` : '';
            const url = `/api/posts?page=${page}&limit=10&department=${department}${categoryParam}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                let errorText = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorText = errorData.message || errorText;
                } catch (jsonError) {
                    try {
                        const rawErrorText = await response.text();
                        errorText = rawErrorText || errorText;
                    } catch (textError) {}
                }
                throw new Error(errorText);
            }

            const data = await response.json();

            if (data && Array.isArray(data.posts)) {
                
                const fetchedPosts: Post[] = data.posts;
                const newlyFetchedLikedIds = new Set<string>();
                
                fetchedPosts.forEach((post: Post) => {
                    if (post.isLikedByCurrentUser) {
                        newlyFetchedLikedIds.add(post._id);
                    }
                });
                
                setPosts(prevPosts => loadMore ? [...prevPosts, ...fetchedPosts] : fetchedPosts);

                if (loadMore) {
                    setLikedPosts(prevLikedPosts => {
                        const updatedLikedPosts = new Set(prevLikedPosts);
                        newlyFetchedLikedIds.forEach(id => updatedLikedPosts.add(id));
                        return updatedLikedPosts;
                    });
                } else {
                    setLikedPosts(newlyFetchedLikedIds);
                }

                setCurrentPage(data.currentPage);
                setTotalPages(data.totalPages);
                const newHasMore = data.currentPage < data.totalPages;
                setHasMore(newHasMore);
                setTotalPages(data.totalPages);
            } else {
                throw new Error('Failed to load posts. Unexpected data format.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load posts.');
            if (!loadMore) setPosts([]);
        } finally {
            if (!loadMore) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    }, []);

    useEffect(() => {
        setPosts([]);
        setCurrentPage(1);
        setHasMore(true);
        fetchPosts(1, selectedDepartment, selectedCategoryFilter);
    }, [selectedDepartment, selectedCategoryFilter, fetchPosts]);

    useEffect(() => {
        if (paginationMode === 'scroll' && currentPage > 1 && hasMore) {
            fetchPosts(currentPage, selectedDepartment, selectedCategoryFilter, true);
        }
    }, [currentPage, selectedDepartment, selectedCategoryFilter, fetchPosts, hasMore, paginationMode]);

    const handleCreatePost = async () => {
        if (!description.trim() || !title.trim()) return;
        setPosting(true);
        setError(null);
        try {
            const response = await fetch('/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ description, title, category: newPostCategory }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create post.');
            }

            const newPost = data.post;
            if (newPost && !newPost.name && user) {
                newPost.name = user.profile_data?.name || 'Anonymous';
                newPost.email = user.email;
                newPost.role = user.role;
                newPost.department = user.profile_data?.department;
            }

            const matchesDepartmentFilter = selectedDepartment === 'All' || newPost.department === selectedDepartment;
            const matchesCategoryFilter = selectedCategoryFilter === 'All' || newPost.category === selectedCategoryFilter;
            
            if (matchesDepartmentFilter && matchesCategoryFilter) {
                setPosts(prevPosts => [newPost, ...prevPosts]);
            }
            
            setDescription('');
            setTitle('');
            setNewPostCategory('Community Post');
            setIsCreateDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post.');
        } finally {
            setPosting(false);
        }
    };

    const handleToggleLike = async (postId: string) => {
        const isCurrentlyLiked = likedPosts.has(postId);
        const increment = !isCurrentlyLiked;

        const newLikedPosts = new Set(likedPosts);
        if (increment) {
            newLikedPosts.add(postId);
        } else {
            newLikedPosts.delete(postId);
        }
        setLikedPosts(newLikedPosts);

        setPosts(currentPosts =>
            currentPosts.map(post =>
                post._id === postId
                    ? { ...post, number_of_likes: post.number_of_likes + (increment ? 1 : -1) }
                    : post
            )
        );

        try {
            const response = await fetch(`/api/posts/${postId}/likes`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ increment }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update likes.');
            }

            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post._id === postId ? { ...post, number_of_likes: data.post.number_of_likes, isLikedByCurrentUser: increment } : post
                )
            );
            setLikedPosts(prevLiked => {
                const updated = new Set(prevLiked);
                if (increment) updated.add(postId);
                else updated.delete(postId);
                return updated;
            });

        } catch (err) {
            alert(`Error updating likes: ${err instanceof Error ? err.message : 'Unknown error'}`);

            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post._id === postId
                        ? { ...post, number_of_likes: post.number_of_likes + (increment ? -1 : 1) }
                        : post
                )
            );
            const revertedLikedPosts = new Set(likedPosts);
            if (increment) {
                revertedLikedPosts.delete(postId);
            } else {
                revertedLikedPosts.add(postId);
            }
            setLikedPosts(revertedLikedPosts);
        }
    };

    const handleDepartmentChange = (event: SelectChangeEvent<string>) => {
        setSelectedDepartment(event.target.value as string);
    };
    
    const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
        setSelectedCategoryFilter(event.target.value as string);
    };
    
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        setPosts([]); 
        fetchPosts(value, selectedDepartment, selectedCategoryFilter);
        
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    
    const togglePaginationMode = () => {
        setPaginationMode(prev => prev === 'scroll' ? 'pagination' : 'scroll');
    };

    return (
        <Box 
            ref={scrollContainerRef} 
            sx={{ 
                p: 3, 
                height: 'calc(100vh - 64px)', 
                overflowY: 'auto'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 0, flexGrow: 1 }}>
                Posts
                </Typography>
                {/* Filters */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel id="category-filter-label">Category</InputLabel>
                        <Select
                            labelId="category-filter-label"
                            value={selectedCategoryFilter}
                            label="Category"
                            onChange={handleCategoryFilterChange}
                        >
                            <MenuItem value="All">All Categories</MenuItem>
                            {postCategories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 150 }} size="small">
                        <InputLabel id="department-filter-label">Department</InputLabel>
                        <Select
                            labelId="department-filter-label"
                            value={selectedDepartment}
                            label="Department"
                            onChange={handleDepartmentChange}
                        >
                            <MenuItem value="All">All Departments</MenuItem>
                            {generateGroupedDepartmentOptions()}
                        </Select>
                    </FormControl>
                </Box>
                {/* Create Post Button */}
                <Button
                    variant="contained"
                    onClick={() => setIsCreateDialogOpen(true)}
                    sx={{ mt: { xs: 1, sm: 0 } }} 
                >
                    Create Post
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {loading && !loadingMore ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List sx={{ width: '100%' }}>
                    {posts.length === 0 && !loading && !loadingMore && (
                        <Typography sx={{ textAlign: 'center', mt: 4 }}>
                            No posts found for {selectedDepartment === 'All' ? 'any department' : selectedDepartment}. Be the first to share!
                        </Typography>
                    )}
                    {posts.map((post, index) => {
                        const isLastPost = posts.length === index + 1;
                        const truncated = post.description.length > 100 ? post.description.slice(0, 100) + '...' : post.description;
                        return (
                            <React.Fragment key={post._id}>
                                <ListItem 
                                    ref={isLastPost ? lastPostElementRef : null}
                                    alignItems="flex-start" 
                                    sx={{ p: 0 }}
                                >
                                    <Card sx={{ width: '100%' }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                <Avatar sx={{ mr: 1.5, bgcolor: 'primary.main' }}>
                                                    {post.name ? post.name.charAt(0).toUpperCase() : 'U'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        {post.name || 'Anonymous'} {post.role && `(${post.role})`}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {post.category} - {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                                        {post.department && ` - ${post.department}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                                {truncated}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
                                            <Button size="small" onClick={() => setViewedPost(post)} sx={{ alignSelf: 'flex-start' }}>
                                                View
                                            </Button>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton size="small" onClick={() => handleToggleLike(post._id)}>
                                                    {likedPosts.has(post._id) ? (
                                                        <ThumbUpIcon fontSize="small" color="primary" />
                                                    ) : (
                                                        <ThumbUpOutlinedIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                                <Typography variant="body2" sx={{ mr: 1 }}>
                                                    {post.number_of_likes}
                                                </Typography>
                                            </Box>
                                        </CardActions>
                                    </Card>
                                </ListItem>
                                {index < posts.length - 1 && <Divider sx={{ my: 2 }} />}
                            </React.Fragment>
                        );
                    })}
                    {loadingMore && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={30} />
                        </Box>
                    )}
                    {!hasMore && posts.length > 0 && paginationMode === 'scroll' && (
                        <Typography sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                            No more posts to load.
                        </Typography>
                    )}
                    
                    {/* Pagination Controls */}
                    {posts.length > 0 && !loading && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 2 }}>
                            <Button 
                                onClick={togglePaginationMode} 
                                sx={{ mb: 2 }}
                                variant="outlined"
                                size="small"
                            >
                                {paginationMode === 'scroll' ? 'Switch to Page Navigation' : 'Switch to Infinite Scroll'}
                            </Button>
                            
                            {paginationMode === 'pagination' && (
                                <Stack spacing={2}>
                                    <Pagination 
                                        count={totalPages} 
                                        page={currentPage} 
                                        onChange={handlePageChange}
                                        color="primary" 
                                        showFirstButton 
                                        showLastButton
                                    />
                                </Stack>
                            )}
                        </Box>
                    )}
                </List>
            )}
            {/* Post View Dialog */}
            <Dialog open={!!viewedPost} onClose={() => setViewedPost(null)} maxWidth="sm" fullWidth>
                <DialogTitle>{viewedPost?.title}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {viewedPost?.name || 'Anonymous'} {viewedPost?.role && `(${viewedPost.role})`} {viewedPost?.department && `- ${viewedPost.department}`}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
                        {viewedPost?.description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewedPost(null)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Create Post Dialog */}
            <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={posting}
                        inputProps={{ maxLength: 100 }}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={posting}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth margin="dense" disabled={posting}>
                        <InputLabel id="new-post-category-label">Category</InputLabel>
                        <Select
                            labelId="new-post-category-label"
                            value={newPostCategory}
                            label="Category"
                            onChange={(e) => setNewPostCategory(e.target.value as string)}
                        >
                            {postCategories.map(cat => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateDialogOpen(false)} disabled={posting}>Cancel</Button>
                    <Button
                        onClick={handleCreatePost}
                        variant="contained"
                        disabled={posting || !description.trim() || !title.trim() || !newPostCategory}
                    >
                        {posting ? <CircularProgress size={24} /> : 'Post'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Posts;