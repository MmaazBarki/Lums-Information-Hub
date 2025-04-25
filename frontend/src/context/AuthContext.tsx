import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  name?: string;
  department?: string; // Ensure department is part of ProfileData
  // Add other profile fields like graduationYear, designation, etc.
}

interface UserInfo {
  id: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data: ProfileData | null;
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: 'student' | 'alumni' | 'admin', name: string, department?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (profileData: Partial<ProfileData>) => Promise<void>;
  isAuthenticated: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }
    return await response.json();
  }, []);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setUser(userInfo);
        }
      } catch (error) {
        // Clear localStorage if there's an error parsing
        localStorage.removeItem('userInfo');
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      const userInfo = {
        id: data._id,
        email: data.email,
        role: data.role,
        profile_data: data.profile_data,
      };
      
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  // Signup function
  const signup = async (email: string, password: string, role: 'student' | 'alumni' | 'admin', name: string, department?: string) => {
    setLoading(true);
    
    try {
      const profileData: ProfileData = { name };
      if (department) {
        profileData.department = department;
      }

      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role, profile_data: profileData }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      const userInfo = {
        id: data._id,
        email: data.email,
        role: data.role,
        profile_data: data.profile_data,
      };
      
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      navigate('/dashboard');
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }

      setUser(null);
      localStorage.removeItem('userInfo');
      
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      localStorage.removeItem('userInfo');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Function to update user profile data both in state and localStorage
  const updateUser = async (profileData: Partial<ProfileData>) => {
    setLoading(true);
    try {
      const data = await apiRequest('http://localhost:5001/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      setUser(prevUser => prevUser ? { ...prevUser, profile_data: { ...prevUser.profile_data, ...data.profile_data } } : null);
      localStorage.setItem('userInfo', JSON.stringify(user));
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};