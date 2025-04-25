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
      console.log('Attempting login with:', { email });
      
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', 
      });

      console.log('Login response status:', response.status);
      
      const setCookieHeader = response.headers.get('Set-Cookie');
      console.log('Set-Cookie header:', setCookieHeader);
      
      console.log('All response headers:');
      response.headers.forEach((value, name) => {
        console.log(`${name}: ${value}`);
      });
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      const userInfo = {
        id: data._id,
        email: data.email,
        role: data.role,
        profile_data: data.profile_data,
      };
      
      console.log('Setting user state with:', userInfo);
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      console.log('Navigating to dashboard...');
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