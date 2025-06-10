import AsyncStorage from '@react-native-async-storage/async-storage';

class ProviderStorage {
  static GOOGLE_CALENDAR_TOKEN = '@google_calendar_token';
  static OUTLOOK_CALENDAR_TOKEN = '@outlook_calendar_token';
  static APPLE_CALENDAR_SETTINGS = '@apple_calendar_settings';

  static async getGoogleToken() {
    try {
      const token = await AsyncStorage.getItem(this.GOOGLE_CALENDAR_TOKEN);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Failed to get Google token:', error);
      return null;
    }
  }

  static async setGoogleToken(token) {
    try {
      await AsyncStorage.setItem(this.GOOGLE_CALENDAR_TOKEN, JSON.stringify(token));
    } catch (error) {
      console.error('Failed to save Google token:', error);
    }
  }

  static async removeGoogleToken() {
    try {
      await AsyncStorage.removeItem(this.GOOGLE_CALENDAR_TOKEN);
    } catch (error) {
      console.error('Failed to remove Google token:', error);
    }
  }

  static async getOutlookToken() {
    try {
      const token = await AsyncStorage.getItem(this.OUTLOOK_CALENDAR_TOKEN);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Failed to get Outlook token:', error);
      return null;
    }
  }

  static async setOutlookToken(token) {
    try {
      await AsyncStorage.setItem(this.OUTLOOK_CALENDAR_TOKEN, JSON.stringify(token));
    } catch (error) {
      console.error('Failed to save Outlook token:', error);
    }
  }

  static async removeOutlookToken() {
    try {
      await AsyncStorage.removeItem(this.OUTLOOK_CALENDAR_TOKEN);
    } catch (error) {
      console.error('Failed to remove Outlook token:', error);
    }
  }

  static async getAppleSettings() {
    try {
      const settings = await AsyncStorage.getItem(this.APPLE_CALENDAR_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Failed to get Apple settings:', error);
      return null;
    }
  }

  static async setAppleSettings(settings) {
    try {
      await AsyncStorage.setItem(this.APPLE_CALENDAR_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save Apple settings:', error);
    }
  }

  static async removeAppleSettings() {
    try {
      await AsyncStorage.removeItem(this.APPLE_CALENDAR_SETTINGS);
    } catch (error) {
      console.error('Failed to remove Apple settings:', error);
    }
  }
}

export default ProviderStorage;
