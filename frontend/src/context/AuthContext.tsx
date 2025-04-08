import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for handling cookies
      });

      const data = await response.json();

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
      
      setUser(userInfo);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData: SignupData) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
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
      const response = await fetch('/api/auth/logout', {
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
      
    } catch (error) {
      console.error('Logout error:', error);
      // Clear user data anyway on error to prevent UI issues
      setUser(null);
      localStorage.removeItem('userInfo');
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
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};