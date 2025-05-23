import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboarding } from './OnboardingContext';

// Create context
const AuthContext = createContext();

// Storage keys
const AUTH_TOKEN_KEY = '@PauseApp:authToken';
const USER_DATA_KEY = '@PauseApp:userData';
const ONBOARDING_USER_DATA_KEY = '@PauseApp:onboardingUserData';

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isSignout: false,
    userToken: null,
    userData: null,
    error: null,
  });
  
  const { completeOnboarding, resetOnboarding, ...onboardingData } = useOnboarding();

  // Load auth state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const [userToken, userDataString] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_DATA_KEY),
        ]);
        
        const userData = userDataString ? JSON.parse(userDataString) : null;
        
        setAuthState({
          isLoading: false,
          isSignout: false,
          userToken,
          userData,
          error: null,
        });
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setAuthState({
          isLoading: false,
          isSignout: false,
          userToken: null,
          userData: null,
          error: 'Failed to load authentication state',
        });
      }
    };

    loadAuthState();
  }, []);

  // Save onboarding data for the user
  const saveOnboardingData = async (userId) => {
    try {
      // Filter out functions and only keep data
      const onboardingDataToSave = {
        schedule: onboardingData.schedule,
        pausePreferences: onboardingData.pausePreferences,
        notificationPreferences: onboardingData.notificationPreferences,
        permissionsGranted: onboardingData.permissionsGranted,
        completed: true,
      };
      
      // Save onboarding data with user ID
      await AsyncStorage.setItem(
        `${ONBOARDING_USER_DATA_KEY}:${userId}`, 
        JSON.stringify(onboardingDataToSave)
      );
      
      return true;
    } catch (error) {
      console.error('Failed to save onboarding data for user:', error);
      return false;
    }
  };

  // Load onboarding data for a specific user
  const loadOnboardingData = async (userId) => {
    try {
      const savedData = await AsyncStorage.getItem(`${ONBOARDING_USER_DATA_KEY}:${userId}`);
      if (savedData) {
        return JSON.parse(savedData);
      }
      return null;
    } catch (error) {
      console.error('Failed to load onboarding data for user:', error);
      return null;
    }
  };

  // Sign in
  const signIn = async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // This would be replaced with an actual API call
      // Simulating API response for demo purposes
      const mockResponse = {
        token: 'mock-auth-token',
        user: {
          id: 'user-123',
          email,
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        }
      };
      
      // Save auth data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockResponse.user)),
      ]);
      
      // Save onboarding data for this user
      await saveOnboardingData(mockResponse.user.id);
      
      // Complete onboarding
      completeOnboarding();
      
      // Update state
      setAuthState({
        isLoading: false,
        isSignout: false,
        userToken: mockResponse.token,
        userData: mockResponse.user,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Authentication failed. Please check your credentials and try again.',
      }));
      return false;
    }
  };

  // Sign up
  const signUp = async (email, password, name) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // This would be replaced with an actual API call
      // Simulating API response for demo purposes
      const mockResponse = {
        token: 'mock-auth-token',
        user: {
          id: 'user-' + Date.now(),
          email,
          name: name || email.split('@')[0],
          createdAt: new Date().toISOString(),
        }
      };
      
      // Save auth data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(mockResponse.user)),
      ]);
      
      // Save onboarding data for this user
      await saveOnboardingData(mockResponse.user.id);
      
      // Complete onboarding
      completeOnboarding();
      
      // Update state
      setAuthState({
        isLoading: false,
        isSignout: false,
        userToken: mockResponse.token,
        userData: mockResponse.user,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.',
      }));
      return false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Clear auth data
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
      
      // Update state
      setAuthState({
        isLoading: false,
        isSignout: true,
        userToken: null,
        userData: null,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to sign out. Please try again.',
      }));
      return false;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // This would be replaced with an actual API call
      // Simulating API response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to reset password. Please try again.',
      }));
      return false;
    }
  };

  // Context value
  const authContext = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword,
    saveOnboardingData,
    loadOnboardingData,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
