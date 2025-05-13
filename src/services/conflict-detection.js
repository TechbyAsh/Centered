import { storage } from '../infrastructure/storage/storage';

class ConflictDetectionService {
  constructor() {
    this.meetings = [];
    this.deadlines = [];
  }

  async init() {
    try {
      const prefs = await storage.getPreferences();
      this.meetings = prefs?.meetings || [];
      this.deadlines = prefs?.deadlines || [];
    } catch (error) {
      console.error('Error initializing conflict detection:', error);
    }
  }

  hasConflict(startTime, endTime, type) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Check meeting conflicts
    const meetingConflict = this.meetings.some(meeting => {
      const meetingStart = new Date(meeting.startTime);
      const meetingEnd = new Date(meeting.endTime);
      
      // Consider buffer times for meetings
      const bufferBefore = 5 * 60 * 1000; // 5 minutes
      const bufferAfter = 5 * 60 * 1000; // 5 minutes
      
      meetingStart.setTime(meetingStart.getTime() - bufferBefore);
      meetingEnd.setTime(meetingEnd.getTime() + bufferAfter);
      
      return (
        (start >= meetingStart && start <= meetingEnd) ||
        (end >= meetingStart && end <= meetingEnd) ||
        (start <= meetingStart && end >= meetingEnd)
      );
    });

    if (meetingConflict) {
      return {
        type: 'meeting',
        message: 'Conflicts with a scheduled meeting',
      };
    }

    // Check deadline conflicts
    const deadlineConflict = this.deadlines.some(deadline => {
      const dueDate = new Date(deadline.dueDate);
      const bufferTime = deadline.bufferMinutes * 60 * 1000 || 30 * 60 * 1000; // Default 30 minutes
      
      // For deadlines, we only check if the transition would interfere with the final stretch
      return (
        start <= dueDate &&
        start >= new Date(dueDate.getTime() - bufferTime)
      );
    });

    if (deadlineConflict) {
      return {
        type: 'deadline',
        message: 'Too close to an upcoming deadline',
      };
    }

    // Special handling for specific transition types
    if (type === 'work-to-break') {
      const nextMeeting = this.getNextMeeting(start);
      if (nextMeeting) {
        const timeUntilMeeting = new Date(nextMeeting.startTime) - start;
        const minimumWorkTime = 15 * 60 * 1000; // 15 minutes
        
        if (timeUntilMeeting < minimumWorkTime) {
          return {
            type: 'upcoming-meeting',
            message: 'Meeting starting soon, stay focused',
          };
        }
      }
    }

    return null;
  }

  getNextMeeting(fromTime) {
    const upcoming = this.meetings
      .filter(meeting => new Date(meeting.startTime) > fromTime)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    return upcoming[0] || null;
  }

  suggestAlternativeTime(originalTime, type) {
    const time = new Date(originalTime);
    const alternatives = [];
    
    // Try slots before and after in 15-minute increments
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue; // Skip original time
      
      const alternativeTime = new Date(time.getTime() + i * 15 * 60 * 1000);
      const transitionDuration = this.getTransitionDuration(type);
      
      if (!this.hasConflict(
        alternativeTime,
        new Date(alternativeTime.getTime() + transitionDuration),
        type
      )) {
        alternatives.push({
          time: alternativeTime,
          offset: i * 15, // minutes from original time
        });
      }
    }
    
    return alternatives;
  }

  getTransitionDuration(type) {
    const durations = {
      'work-to-break': 5 * 60 * 1000,
      'break-to-work': 3 * 60 * 1000,
      'morning-start': 10 * 60 * 1000,
      'evening-wind-down': 15 * 60 * 1000,
    };
    
    return durations[type] || 5 * 60 * 1000;
  }

  async updateMeetings(meetings) {
    this.meetings = meetings;
    try {
      const prefs = await storage.getPreferences();
      await storage.setPreferences({
        ...prefs,
        meetings,
      });
    } catch (error) {
      console.error('Error updating meetings:', error);
    }
  }

  async updateDeadlines(deadlines) {
    this.deadlines = deadlines;
    try {
      const prefs = await storage.getPreferences();
      await storage.setPreferences({
        ...prefs,
        deadlines,
      });
    } catch (error) {
      console.error('Error updating deadlines:', error);
    }
  }
}

export const conflictDetection = new ConflictDetectionService();
