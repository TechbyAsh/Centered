import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';

const CALENDAR_CACHE_KEY = '@calendar_cache';
const CALENDAR_SYNC_TIME_KEY = '@calendar_last_sync';
const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

class CalendarService {
  constructor() {
    this.calendars = [];
    this.events = [];
  }

  async initialize() {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        await this.loadCalendars();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Calendar initialization failed:', error);
      return false;
    }
  }

  async loadCalendars() {
    try {
      this.calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error('Failed to load calendars:', error);
      this.calendars = [];
    }
  }

  async getEvents(startDate, endDate) {
    try {
      // Check if we can use cached data
      const cachedData = await this.getCachedEvents();
      const lastSync = await AsyncStorage.getItem(CALENDAR_SYNC_TIME_KEY);
      const now = new Date().getTime();

      if (cachedData && lastSync && (now - parseInt(lastSync) < SYNC_INTERVAL)) {
        return this.filterEventsByDateRange(cachedData, startDate, endDate);
      }

      // Fetch fresh data if cache is invalid or expired
      const events = [];
      for (const calendar of this.calendars) {
        const calendarEvents = await Calendar.getEventsAsync(
          [calendar.id],
          startDate,
          endDate
        );
        events.push(...calendarEvents);
      }

      // Cache the results
      await this.cacheEvents(events);
      await AsyncStorage.setItem(CALENDAR_SYNC_TIME_KEY, now.toString());

      return events;
    } catch (error) {
      console.error('Failed to get events:', error);
      // Return cached data as fallback
      const cachedData = await this.getCachedEvents();
      return cachedData ? this.filterEventsByDateRange(cachedData, startDate, endDate) : [];
    }
  }

  filterEventsByDateRange(events, startDate, endDate) {
    return events.filter(event => {
      const eventStart = new Date(event.startDate).getTime();
      const eventEnd = new Date(event.endDate).getTime();
      return eventStart >= startDate.getTime() && eventEnd <= endDate.getTime();
    });
  }

  async getCachedEvents() {
    try {
      const cached = await AsyncStorage.getItem(CALENDAR_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to get cached events:', error);
      return null;
    }
  }

  async cacheEvents(events) {
    try {
      await AsyncStorage.setItem(CALENDAR_CACHE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to cache events:', error);
    }
  }

  async clearCache() {
    try {
      await AsyncStorage.multiRemove([CALENDAR_CACHE_KEY, CALENDAR_SYNC_TIME_KEY]);
    } catch (error) {
      console.error('Failed to clear calendar cache:', error);
    }
  }
}

export default new CalendarService();
