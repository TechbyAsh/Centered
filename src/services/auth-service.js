// auth-service.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase API endpoints
const SUPABASE_URL = "https://lcigyiaryxeajdjaqbfv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaWd5aWFyeXhlYWpkamFxYmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzM0OTIsImV4cCI6MjA2Mzg0OTQ5Mn0.FF-6spGN1-h5Z54pKC4F33hEqueabgQXElrqQCt85cM";

// Auth storage keys
const USER_KEY = '@PauseApp:user';
const SESSION_KEY = '@PauseApp:session';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${SUPABASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }
  
  return data;
};

// Sign up function
export const signUp = async (email, password, name) => {
  try {
    const response = await apiRequest('/auth/v1/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        data: { name }
      })
    });

    if (response.error) {
      return { 
        success: false, 
        error: response.error.message 
      };
    }

    // Check if email confirmation is required
    if (response.user && !response.session) {
      return { 
        success: false, 
        emailConfirmationRequired: true 
      };
    }

    if (response.user && response.session) {
      // Store user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(response.session));
      
      return { success: true };
    }
    
    return { success: false };
  } catch (err) {
    console.error('Sign up error:', err);
    return { 
      success: false, 
      error: err.message 
    };
  }
};

// Sign in function
export const signIn = async (email, password) => {
  try {
    const response = await apiRequest('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      })
    });

    if (response.error) {
      return false;
    }

    if (response.user && response.access_token) {
      const session = {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        expires_at: new Date(Date.now() + response.expires_in * 1000).toISOString()
      };
      
      // Store user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      
      return true;
    }
    
    return false;
  } catch (err) {
    console.error('Sign in error:', err);
    return false;
  }
};

// Sign out function
export const signOut = async () => {
  try {
    const session = await getSession();
    
    if (session?.access_token) {
      await apiRequest('/auth/v1/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
    }
    
    // Clear user data
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(SESSION_KEY);
    
    return true;
  } catch (err) {
    console.error('Sign out error:', err);
    
    // Still clear local data even if API call fails
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(SESSION_KEY);
    
    return true;
  }
};

// Get current session
export const getSession = async () => {
  try {
    const sessionStr = await AsyncStorage.getItem(SESSION_KEY);
    if (sessionStr) {
      return JSON.parse(sessionStr);
    }
    return null;
  } catch (err) {
    console.error('Get session error:', err);
    return null;
  }
};

// Get current user
export const getUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (err) {
    console.error('Get user error:', err);
    return null;
  }
};