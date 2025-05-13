import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { storage } from '../infrastructure/storage/storage';

class CalendarService {
  constructor() {
    this.calendars = [];
    this.selectedCalendarIds = [];
    this.events = [];
  }

  async init() {
    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        return false;
      }

      // Load saved calendar preferences
      const prefs = await storage.getPreferences();
      this.selectedCalendarIds = prefs?.selectedCalendarIds || [];

      // Get available calendars
      await this.loadCalendars();
      
      // Initial sync
      await this.syncEvents();
      
      return true;
    } catch (error) {
      console.error('Error initializing calendar service:', error);
      return false;
    }
  }

  async loadCalendars() {
    try {
      // Get all calendars
      this.calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      // Filter to only show calendars that can be modified
      this.calendars = this.calendars.filter(calendar => 
        calendar.allowsModifications && 
        (calendar.source.type === 'LOCAL' || calendar.source.type === 'CALDAV')
      );
    } catch (error) {
      console.error('Error loading calendars:', error);
      this.calendars = [];
    }
  }

  async syncEvents(days = 7) {
    if (this.selectedCalendarIds.length === 0) return;

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      this.events = [];
      
      // Fetch events from each selected calendar
      for (const calendarId of this.selectedCalendarIds) {
        const events = await Calendar.getEventsAsync(
          [calendarId],
          startDate,
          endDate
        );
        
        this.events.push(...events.map(event => ({
          ...event,
          calendarId,
        })));
      }

      // Update conflict detection service with new events
      await this.updateConflictDetection();
      
      return this.events;
    } catch (error) {
      console.error('Error syncing events:', error);
      return [];
    }
  }

  async updateConflictDetection() {
    // Convert calendar events to meetings format for conflict detection
    const meetings = this.events.map(event => ({
      id: event.id,
      title: event.title,
      startTime: new Date(event.startDate),
      endTime: new Date(event.endDate),
      calendarId: event.calendarId,
      isAllDay: event.allDay,
    }));

    // Update conflict detection service
    await storage.setItem('meetings', meetings);
    
    // Notify conflict detection service of updates
    const { conflictDetection } = await import('./conflict-detection');
    await conflictDetection.updateMeetings(meetings);
  }

  async addTransitionToCalendar(type, startTime, duration) {
    if (this.selectedCalendarIds.length === 0) return null;

    try {
      const calendarId = this.selectedCalendarIds[0]; // Use first selected calendar
      const endTime = new Date(startTime.getTime() + duration * 1000);

      const eventDetails = {
        title: this.getTransitionTitle(type),
        notes: this.getTransitionNotes(type),
        startDate: startTime,
        endDate: endTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        alarms: [{
          relativeOffset: -5, // 5 minutes before
          method: Calendar.AlarmMethod.ALERT,
        }],
      };

      const eventId = await Calendar.createEventAsync(calendarId, eventDetails);
      
      // Sync to update local events
      await this.syncEvents();
      
      return eventId;
    } catch (error) {
      console.error('Error adding transition to calendar:', error);
      return null;
    }
  }

  getTransitionTitle(type) {
    const titles = {
      'work-to-break': '🌟 Mindful Break',
      'break-to-work': '💪 Return to Work',
      'morning-start': '🌅 Morning Routine',
      'evening-wind-down': '🌙 Evening Wind Down',
    };
    return titles[type] || 'Mindful Transition';
  }

  getTransitionNotes(type) {
    const notes = {
      'work-to-break': 'Take a moment to pause and reset.',
      'break-to-work': 'Mindfully transition back to focused work.',
      'morning-start': 'Start your day with intention and clarity.',
      'evening-wind-down': 'Reflect and prepare for a restful evening.',
    };
    return notes[type] || '';
  }

  async updateCalendarSelections(calendarIds) {
    this.selectedCalendarIds = calendarIds;
    
    try {
      const prefs = await storage.getPreferences();
      await storage.setPreferences({
        ...prefs,
        selectedCalendarIds: calendarIds,
      });

      // Sync events with new calendar selection
      await this.syncEvents();
    } catch (error) {
      console.error('Error updating calendar selections:', error);
    }
  }

  getCalendars() {
    return this.calendars;
  }

  getSelectedCalendarIds() {
    return this.selectedCalendarIds;
  }

  getEvents() {
    return this.events;
  }
}

export const calendarService = new CalendarService();
