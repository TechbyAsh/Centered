import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import ProviderStorage from '../storage/ProviderStorage';
import { OAUTH_CONFIG } from '../config/oauth';

class OutlookCalendarProvider {
  constructor() {
    this.accessToken = null;
    this.discoveryEndpoint = 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration';
    this.clientId = OAUTH_CONFIG.outlook.clientId;
    this.redirectUri = AuthSession.makeRedirectUri({
      scheme: 'centered'
    });
  }

  async initialize() {
    try {
      this.accessToken = await ProviderStorage.getOutlookToken();
      return !!this.accessToken;
    } catch (error) {
      console.error('Failed to initialize Outlook Calendar:', error);
      return false;
    }
  }

  async authenticate() {
    try {
      // Get discovery document
      const discovery = await AuthSession.fetchDiscoveryAsync(this.discoveryEndpoint);

      // Create auth request
      const authRequest = new AuthSession.AuthRequest({
        clientId: this.clientId,
        scopes: OAUTH_CONFIG.outlook.scopes,
        redirectUri: this.redirectUri,
      });

      // Prompt user to authenticate
      const result = await authRequest.promptAsync(discovery);
      
      if (result.type === 'success') {
        await ProviderStorage.setOutlookToken(result.authentication);
        this.accessToken = result.authentication;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to authenticate Outlook Calendar:', error);
      return false;
    }
  }

  async getEvents(startDate, endDate) {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Outlook Calendar');
    }

    try {
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=${startDate.toISOString()}&endDateTime=${endDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken.accessToken}`,
          },
        }
      );

      const data = await response.json();
      return data.value.map(event => ({
        id: event.id,
        title: event.subject,
        start: new Date(event.start.dateTime),
        end: new Date(event.end.dateTime),
        provider: 'outlook'
      }));
    } catch (error) {
      console.error('Failed to fetch Outlook Calendar events:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await ProviderStorage.removeOutlookToken();
      this.accessToken = null;
      return true;
    } catch (error) {
      console.error('Failed to disconnect Outlook Calendar:', error);
      return false;
    }
  }
}

export default OutlookCalendarProvider;
