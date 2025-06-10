import ProviderStorage from '../storage/ProviderStorage';
import * as Calendar from 'expo-calendar';

const APPLE_CALENDAR_SETTINGS = '@apple_calendar_settings';

export class AppleCalendarProvider {
  constructor() {
    this.selectedCalendars = [];
  }

  async initialize() {
    try {
      const settings = await ProviderStorage.getAppleSettings();
      if (settings) {
        this.selectedCalendars = settings;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize Apple Calendar:', error);
      return false;
    }
  }

  async getAvailableCalendars() {
    try {
      return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error('Failed to get Apple Calendars:', error);
      return [];
    }
  }

  async selectCalendars(calendars) {
    try {
      this.selectedCalendars = calendars;
      await ProviderStorage.setAppleSettings(calendars);
      return true;
    } catch (error) {
      console.error('Failed to save Apple Calendar settings:', error);
      return false;
    }
  }

  async getEvents(startDate, endDate) {
    try {
      const events = [];
      const calendars = this.selectedCalendars.length > 0 
        ? this.selectedCalendars 
        : (await this.getAvailableCalendars()).map(cal => cal.id);

      for (const calendarId of calendars) {
        const calendarEvents = await Calendar.getEventsAsync(
          [calendarId],
          startDate,
          endDate
        );
        events.push(...calendarEvents.map(event => ({
          ...event,
          provider: 'apple'
        })));
      }

      return events;
    } catch (error) {
      console.error('Failed to fetch Apple Calendar events:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await ProviderStorage.removeAppleSettings();
      this.selectedCalendars = null;
      return true;
    } catch (error) {
      console.error('Failed to disconnect Apple Calendar:', error);
      return false;
    }
  }
}
