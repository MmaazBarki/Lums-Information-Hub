import User from '../models/user.models.js';
import Post from '../models/post.model.js';
import AcademicResource from '../models/academicResource.model.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    if (!postId) {
      return res.status(400).json({ error: 'Post ID is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
};


export const deleteResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    
    if (!resourceId) {
      return res.status(400).json({ error: 'Resource ID is required' });
    }

    const resource = await AcademicResource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await AcademicResource.findByIdAndDelete(resourceId);
    return res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return res.status(500).json({ error: 'Failed to delete resource' });
  }
};