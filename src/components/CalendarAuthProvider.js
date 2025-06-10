import React from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Calendar from 'expo-calendar';
import CalendarManager from '../services/calendar/CalendarManager';

WebBrowser.maybeCompleteAuthSession();

const googleConfig = {
  clientId: '539064377550-42d3g6n93fc0uoatufilt5si2d4u6rjv.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'centered'
  })
};

const outlookConfig = {
  clientId: 'YOUR_OUTLOOK_CLIENT_ID',
  scopes: ['Calendars.Read'],
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'centered'
  })
};

WebBrowser.maybeCompleteAuthSession();

// Create context using React.createContext
const CalendarAuthContext = React.createContext(null);

export const useCalendarAuth = () => {
  const context = React.useContext(CalendarAuthContext);
  if (!context) {
    throw new Error('useCalendarAuth must be used within a CalendarAuthProvider');
  }
  return context;
};

export const CalendarAuthProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [calendarPermissionStatus, setCalendarPermissionStatus] = React.useState('undetermined');
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState(null);

  // Initialize calendar permissions
  React.useEffect(() => {
    const checkPermissions = async () => {
      try {
        const { status } = await Calendar.getPermissionsAsync();
        setCalendarPermissionStatus(status);
      } catch (err) {
        console.error('Error checking calendar permissions:', err);
        setCalendarPermissionStatus('undetermined');
      }
    };

    checkPermissions();
  }, []);

  const authenticateGoogle = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthLoading(true);
      setAuthError(null);

      const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
      const request = await AuthSession.startAsync({
        authUrl: AuthSession.makeAuthUrlAsync({
          ...googleConfig,
          responseType: AuthSession.ResponseType.Token,
          discovery
        })
      });

      if (request.type === 'success') {
        await CalendarManager.activateProvider('google', {
          accessToken: request.params.access_token
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Google authentication failed:', error);
      setAuthError(error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const authenticateOutlook = React.useCallback(async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      const discovery = await AuthSession.fetchDiscoveryAsync('https://login.microsoftonline.com/common/v2.0');
      const request = await AuthSession.startAsync({
        authUrl: AuthSession.makeAuthUrlAsync({
          ...outlookConfig,
          responseType: AuthSession.ResponseType.Token,
          discovery
        })
      });

      if (request.type === 'success') {
        await CalendarManager.activateProvider('outlook', {
          accessToken: request.params.access_token
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Outlook authentication failed:', error);
      setAuthError(error.message);
      return false;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const requestCalendarPermissions = React.useCallback(async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setCalendarPermissionStatus(status);
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request calendar permissions:', error);
      return false;
    }
  }, []);

  const authenticateApple = React.useCallback(async () => {
    // First request permissions
    const hasPermission = await requestCalendarPermissions();
    if (!hasPermission) {
      return false;
    }

    try {
      return await CalendarManager.activateProvider('apple');
    } catch (error) {
      console.error('Apple calendar activation failed:', error);
      return false;
    }
  }, []);

  const value = {
    authenticateGoogle,
    authenticateOutlook,
    authenticateApple,
    loading: authLoading,
    error: authError,
    calendarPermissionStatus,
    requestCalendarPermissions
  };

  return (
    <CalendarAuthContext.Provider value={value}>
      {children}
    </CalendarAuthContext.Provider>
  );
};
