import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import ProviderStorage from '../storage/ProviderStorage';
import { OAUTH_CONFIG } from '../config/oauth';
import { Platform } from 'react-native';

class GoogleCalendarProvider {
  constructor() {
    this.accessToken = null;
    this._initializeAuth();
  }

  _initializeAuth() {
    // Default to Expo client ID if platform-specific IDs aren't available
  const clientId = Platform.select({
    ios: OAUTH_CONFIG.google.iosClientId || OAUTH_CONFIG.google.expoClientId,
    android: OAUTH_CONFIG.google.androidClientId || OAUTH_CONFIG.google.expoClientId,
    default: OAUTH_CONFIG.google.expoClientId,
  });

  [this.request, this.response, this.promptAsync] = Google.useAuthRequest({
    clientId,
    scopes: OAUTH_CONFIG.google.scopes,
  });
}

  async initialize() {
    try {
      this.accessToken = await ProviderStorage.getGoogleToken();
      return !!this.accessToken;
    } catch (error) {
      console.error('Failed to initialize Google Calendar:', error);
      return false;
    }
  }

  async authenticate() {
    try {
      const result = await this.promptAsync();
      if (result?.type === 'success') {
        const { authentication } = result;
        await ProviderStorage.setGoogleToken(authentication);
        this.accessToken = authentication;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to authenticate Google Calendar:', error);
      return false;
    }
  }

  async getEvents(startDate, endDate) {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Google Calendar');
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${startDate.toISOString()}&timeMax=${endDate.toISOString()}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken.accessToken}`,
          },
        }
      );

      const data = await response.json();
      return data.items.map(event => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        provider: 'google'
      }));
    } catch (error) {
      console.error('Failed to fetch Google Calendar events:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await ProviderStorage.removeGoogleToken();
      this.accessToken = null;
      return true;
    } catch (error) {
      console.error('Failed to disconnect Google Calendar:', error);
      return false;
    }
  }
}

export default GoogleCalendarProvider;
