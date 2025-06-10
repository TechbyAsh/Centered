import { useState, useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Microsoft from 'expo-auth-session/providers/microsoft';
import * as WebBrowser from 'expo-web-browser';
import CalendarManager from '../services/calendar/CalendarManager';

WebBrowser.maybeCompleteAuthSession();

export const useCalendarAuth = (provider) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    scopes: ['https://www.googleapis.com/auth/calendar.readonly']
  });

  const [msRequest, msResponse, msPromptAsync] = Microsoft.useAuthRequest({
    clientId: 'YOUR_OUTLOOK_CLIENT_ID',
    scopes: ['Calendars.Read'],
    redirectUri: Microsoft.makeRedirectUri({
      scheme: 'your-app-scheme'
    })
  });

  useEffect(() => {
    if (provider === 'google') {
      setRequest(googleRequest);
    } else if (provider === 'outlook') {
      setRequest(msRequest);
    }
  }, [provider, googleRequest, msRequest]);

  const authenticate = async () => {
    try {
      setLoading(true);
      setError(null);

      if (provider === 'google') {
        const result = await googlePromptAsync();
        if (result.type === 'success') {
          await CalendarManager.activateProvider('google', result.authentication);
          return true;
        }
      } else if (provider === 'outlook') {
        const result = await msPromptAsync();
        if (result.type === 'success') {
          await CalendarManager.activateProvider('outlook', result.authentication);
          return true;
        }
      } else if (provider === 'apple') {
        return await CalendarManager.activateProvider('apple');
      }

      return false;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    request,
    loading,
    error,
    authenticate
  };
};
