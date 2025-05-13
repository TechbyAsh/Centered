import { useState, useEffect, useCallback } from 'react';
import { storage } from '../infrastructure/storage/storage';
import { notificationService } from '../services/notifications';
import { conflictDetection } from '../services/conflict-detection';

const TRANSITION_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useTransitionSuggestions = () => {
  const [schedule, setSchedule] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadScheduleAndSettings();
    initServices();
  }, []);

  const loadScheduleAndSettings = async () => {
    try {
      const prefs = await storage.getPreferences();
      if (prefs?.schedule) {
        setSchedule(prefs.schedule);
        setSettings(prefs.transitionSettings);
        generateSuggestions(prefs.schedule, prefs.transitionSettings);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const initServices = useCallback(async () => {
    await Promise.all([
      notificationService.init(),
      conflictDetection.init()
    ]);
  }, []);

  const scheduleNotifications = useCallback(async (suggestions, settings) => {
    // Cancel existing notifications first
    await notificationService.cancelAllNotifications();

    // Schedule new notifications
    for (const suggestion of suggestions) {
      await notificationService.scheduleTransitionReminder(
        suggestion.type,
        suggestion.time,
        settings
      );
    }
  }, []);

  const generateSuggestions = (schedule, settings) => {
    const now = new Date();
    const suggestions = [];

    // Convert schedule times to Date objects for today
    const times = {
      wakeTime: new Date(schedule.wakeTime),
      workStartTime: new Date(schedule.workStartTime),
      lunchTime: new Date(schedule.lunchTime),
      workEndTime: new Date(schedule.workEndTime),
      bedTime: new Date(schedule.bedTime),
    };

    // Set all times to today's date
    Object.keys(times).forEach(key => {
      const time = times[key];
      time.setFullYear(now.getFullYear());
      time.setMonth(now.getMonth());
      time.setDate(now.getDate());
    });

    // Morning start suggestion
    if (now < times.workStartTime) {
      const morningStart = new Date(times.wakeTime.getTime() + TRANSITION_BUFFER);
      suggestions.push({
        type: 'morning-start',
        time: morningStart,
        message: 'Start your day mindfully',
      });
    }

    // Work start suggestion
    if (now < times.workStartTime) {
      const workStart = new Date(times.workStartTime.getTime() - TRANSITION_BUFFER);
      suggestions.push({
        type: 'break-to-work',
        time: workStart,
        message: 'Prepare for focused work',
      });
    }

    // Pre-lunch suggestion
    if (now < times.lunchTime) {
      const preLunch = new Date(times.lunchTime.getTime() - TRANSITION_BUFFER);
      suggestions.push({
        type: 'work-to-break',
        time: preLunch,
        message: 'Wind down for lunch break',
      });
    }

    // Post-lunch suggestion
    if (now < new Date(times.lunchTime.getTime() + 60 * 60 * 1000)) { // 1 hour lunch
      const postLunch = new Date(times.lunchTime.getTime() + 60 * 60 * 1000 - TRANSITION_BUFFER);
      suggestions.push({
        type: 'break-to-work',
        time: postLunch,
        message: 'Return to work mindfully',
      });
    }

    // Work end suggestion
    if (now < times.workEndTime) {
      const workEnd = new Date(times.workEndTime.getTime() - TRANSITION_BUFFER);
      suggestions.push({
        type: 'evening-wind-down',
        time: workEnd,
        message: 'End your workday intentionally',
      });
    }

    // Filter out suggestions that are too close to now or have conflicts
    const validSuggestions = suggestions
      .filter(suggestion => {
        // Check if it's in the future
        if (suggestion.time <= now) return false;

        // Check for conflicts
        const endTime = new Date(suggestion.time.getTime() + (suggestion.duration || 300) * 1000);
        const conflict = conflictDetection.hasConflict(suggestion.time, endTime, suggestion.type);

        if (conflict) {
          // Store conflict information
          suggestion.conflict = conflict;
          // Get alternative times
          suggestion.alternatives = conflictDetection.suggestAlternativeTime(suggestion.time, suggestion.type);
          return false;
        }

        return true;
      })
      .sort((a, b) => a.time - b.time);

    setSuggestions(validSuggestions);
    
    // Schedule notifications for the valid suggestions
    if (settings?.notifications?.enabled !== false) {
      scheduleNotifications(validSuggestions, settings);
    }
  };

  // Refresh suggestions every minute
  useEffect(() => {
    if (schedule && settings) {
      const interval = setInterval(() => {
        generateSuggestions(schedule, settings);
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [schedule, settings]);

  return {
    suggestions,
    refreshSuggestions: () => schedule && generateSuggestions(schedule),
  };
};
