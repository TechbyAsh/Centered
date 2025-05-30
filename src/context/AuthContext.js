import { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/auth-service';

// Create the auth context
const AuthContext = createContext();

// For testing purposes - set to false in production
export const BYPASS_AUTH = true;

// Mock user data for testing
const MOCK_USER = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User'
};

const MOCK_SESSION = {
  id: 'test-session-id',
  token: 'test-token'
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(BYPASS_AUTH ? MOCK_USER : null);
  const [session, setSession] = useState(BYPASS_AUTH ? MOCK_SESSION : null);
  const [loading, setLoading] = useState(!BYPASS_AUTH);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (BYPASS_AUTH) return; // Skip initialization if bypassing auth
      
      setLoading(true);
      try {
        const currentSession = await authService.getSession();
        const currentUser = await authService.getUser();
        
        if (currentSession && currentUser) {
          setSession(currentSession);
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Sign up function
  const signUp = async (email, password, name) => {
    console.log('AuthContext: signUp called with:', { email, name });
    const result = await authService.signUp(email, password, name);
    console.log('AuthContext: signUp result:', result);
    return result;
  };

  // Sign in function
  const signIn = async (email, password) => {
    console.log('AuthContext: signIn called with:', { email });
    const success = await authService.signIn(email, password);
    console.log('AuthContext: signIn result:', success);
    if (success) {
      const currentUser = await authService.getUser();
      const currentSession = await authService.getSession();
      setUser(currentUser);
      setSession(currentSession);
    }
    return success;
  };

  // Sign out function
  const signOut = async () => {
    console.log('AuthContext: signOut called');
    const success = await authService.signOut();
    console.log('AuthContext: signOut result:', success);
    if (success) {
      setUser(null);
      setSession(null);
    }
    return success;
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut
  };

  // Return provider
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
