import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  id: string;
  email: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data: any | null;
}

interface AuthContextType {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<UserInfo>) => void;
  isAuthenticated: boolean;
  uploadProfilePicture: (imageData: string) => Promise<void>;
  removeProfilePicture: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data?: any;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: () => {},
  isAuthenticated: false,
  uploadProfilePicture: async () => {},
  removeProfilePicture: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setUser(userInfo);
        }
      } catch (error) {
        localStorage.removeItem('userInfo');
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

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

  const signup = async (userData: SignupData) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
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

  const updateUser = (userData: Partial<UserInfo>) => {
    if (!user) return; 
    
    const updatedUser = {
      ...user,
      ...userData,
    };
    
    setUser(updatedUser);
    
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
  };

  const uploadProfilePicture = async (imageData: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5001/api/profile/profile-picture/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload profile picture');
      }
      
      const updatedUser = {
        ...user,
        profile_data: {
          ...user.profile_data,
          profilePicture: data.profilePicture
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Profile picture upload error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const removeProfilePicture = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const response = await fetch(`http://localhost:5001/api/profile/profile-picture/${user.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove profile picture');
      }
      
      const updatedUser = {
        ...user,
        profile_data: {
          ...user.profile_data,
          profilePicture: { url: "", publicId: "" }
        }
      };
      
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Profile picture removal error:', error);
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
        uploadProfilePicture,
        removeProfilePicture,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};