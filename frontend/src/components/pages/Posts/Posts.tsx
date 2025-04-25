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
    Select,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../context/AuthContext';
import { generateGroupedDepartmentOptions } from '../../../constants/departments.tsx';

interface Post {
    _id: string;
    title: string;
    name: string;
    email: string;
    description: string;
    department?: string;
    role?: string;
    number_of_likes: number;
    created_at: string;
}

const Posts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [description, setDescription] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [posting, setPosting] = useState<boolean>(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const observer = useRef<IntersectionObserver | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const lastPostElementRef = useCallback((node: HTMLLIElement | null) => {
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
    }, [loading, loadingMore, hasMore]);

    const fetchPosts = useCallback(async (page: number, department: string, loadMore = false) => {
        if (!loadMore) {
            setLoading(true);
        } else {
            setLoadingMore(true);
        }
        setError(null);
        try {
            const url = `/api/posts?page=${page}&limit=10&department=${department}`;
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
                setPosts(prevPosts => loadMore ? [...prevPosts, ...data.posts] : data.posts);
                setCurrentPage(data.currentPage);
                const newHasMore = data.currentPage < data.totalPages;
                setHasMore(newHasMore);
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
        fetchPosts(1, selectedDepartment);
    }, [selectedDepartment, fetchPosts]);

    useEffect(() => {
        if (currentPage > 1 && hasMore) {
            fetchPosts(currentPage, selectedDepartment, true);
        }
    }, [currentPage, selectedDepartment, fetchPosts, hasMore]);

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
                body: JSON.stringify({ description, title }),
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

            if (selectedDepartment === 'All' || newPost.department === selectedDepartment) {
                setPosts(prevPosts => [newPost, ...prevPosts]);
            }
            setDescription('');
            setTitle('');
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
                    post._id === postId ? { ...post, number_of_likes: data.post.number_of_likes } : post
                )
            );

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

    return (
        <Box 
            ref={scrollContainerRef} 
            sx={{ 
                p: 3, 
                height: 'calc(100vh - 64px)', 
                overflowY: 'auto'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
                    Community Posts
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
                    <InputLabel id="department-filter-label">Department</InputLabel>
                    <Select
                        labelId="department-filter-label"
                        id="department-filter-select"
                        value={selectedDepartment}
                        label="Department"
                        onChange={handleDepartmentChange}
                    >
                        {generateGroupedDepartmentOptions()}
                    </Select>
                </FormControl>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a short title for your post..."
                        variant="outlined"
                        disabled={posting}
                        inputProps={{ maxLength: 100 }}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Share something with the community..."
                        variant="outlined"
                        disabled={posting}
                    />
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleCreatePost}
                        disabled={posting || !description.trim() || !title.trim()}
                    >
                        {posting ? <CircularProgress size={24} /> : 'Post'}
                    </Button>
                </CardActions>
            </Card>

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
                                                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                                        {post.department && ` - ${post.department}`}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="h6" component="div" gutterBottom>
                                                {post.title}
                                            </Typography>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {post.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions disableSpacing sx={{ justifyContent: 'space-between', px: 2, pb: 1 }}>
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
                    {!hasMore && posts.length > 0 && (
                        <Typography sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                            No more posts to load.
                        </Typography>
                    )}
                </List>
            )}
        </Box>
    );
};

export default Posts;