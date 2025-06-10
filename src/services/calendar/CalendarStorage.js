import AsyncStorage from '@react-native-async-storage/async-storage';

export class CalendarStorage {
  static ACTIVE_PROVIDERS_KEY = '@calendar_active_providers';
  static CALENDAR_CACHE_KEY = '@calendar_events_cache';
  static CALENDAR_SYNC_TIME_KEY = '@calendar_last_sync';

  static async getActiveProviders() {
    try {
      const savedProviders = await AsyncStorage.getItem(this.ACTIVE_PROVIDERS_KEY);
      return savedProviders ? JSON.parse(savedProviders) : [];
    } catch (error) {
      console.error('Failed to get active providers:', error);
      return [];
    }
  }

  static async setActiveProviders(providers) {
    try {
      await AsyncStorage.setItem(this.ACTIVE_PROVIDERS_KEY, JSON.stringify(providers));
    } catch (error) {
      console.error('Failed to save active providers:', error);
    }
  }

  static async getCachedEvents() {
    try {
      const cachedData = await AsyncStorage.getItem(this.CALENDAR_CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error('Failed to get cached events:', error);
      return null;
    }
  }

  static async cacheEvents(events) {
    try {
      await AsyncStorage.setItem(this.CALENDAR_CACHE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to cache events:', error);
    }
  }

  static async getLastSyncTime() {
    try {
      return await AsyncStorage.getItem(this.CALENDAR_SYNC_TIME_KEY);
    } catch (error) {
      console.error('Failed to get last sync time:', error);
      return null;
    }
  }

  static async setLastSyncTime(time) {
    try {
      await AsyncStorage.setItem(this.CALENDAR_SYNC_TIME_KEY, time.toString());
    } catch (error) {
      console.error('Failed to save last sync time:', error);
    }
  }
}
