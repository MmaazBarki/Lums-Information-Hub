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
  isAuthenticated: boolean;
}

interface SignupData {
  email: string;
  password: string;
  role: 'student' | 'alumni' | 'admin';
  profile_data?: any;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
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
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email });
      
      // // TEMPORARY SOLUTION: Skip backend auth and create mock user
      // // This will allow you to test navigation while backend issues are resolved
      // const mockUser: UserInfo = {
      //   id: '12345',
      //   email: email,
      //   role: 'student', // Explicitly typing as one of the allowed role values
      //   profile_data: {
      //     name: 'Test User',
      //     department: 'Computer Science'
      //   },
      // };
      
      // console.log('Setting mock user state for development:', mockUser);
      // setUser(mockUser);
      // localStorage.setItem('userInfo', JSON.stringify(mockUser));
      
      // console.log('Navigating to dashboard...');
      // // Navigate to dashboard after mock login
      // navigate('/dashboard');
      
      // /* UNCOMMENT THIS WHEN BACKEND IS READY
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for handling cookies
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user in state and localStorage
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
      // Navigate to dashboard after successful login
      navigate('/dashboard');
      // */
      
    } catch (error) {
      console.error('Login error:', error);
      // Ensure we're properly throwing the error so it can be caught by the Login component
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Signup function
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

      // Store user in state and localStorage
      const userInfo = {
        id: data._id,
        email: data.email,
        role: data.role,
        profile_data: data.profile_data,
      };
      
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      // Navigate to dashboard after successful signup
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

      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('userInfo');
      
      // Navigate back to login page
      navigate('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user data anyway on error to prevent UI issues
      setUser(null);
      localStorage.removeItem('userInfo');
      navigate('/login');
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};