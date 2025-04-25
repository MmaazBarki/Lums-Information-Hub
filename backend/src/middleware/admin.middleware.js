import jwt from 'jsonwebtoken';
import User from '../models/user.models.js';

export const isAdmin = async (req, res, next) => {
  try {
    // Get token from the authorization header
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists and is an admin
    const user = await User.findById(decoded.userID).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required' });
    }

    // If user is an admin, continue
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};