import { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/auth-service';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
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
    return await authService.signUp(email, password, name);
  };

  // Sign in function
  const signIn = async (email, password) => {
    const success = await authService.signIn(email, password);
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
    const success = await authService.signOut();
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
