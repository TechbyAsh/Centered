import { useState, useEffect } from 'react';
import { storage } from '../infrastructure/storage/storage';

const TRANSITION_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useTransitionSuggestions = () => {
  const [schedule, setSchedule] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const prefs = await storage.getPreferences();
      if (prefs?.schedule) {
        setSchedule(prefs.schedule);
        generateSuggestions(prefs.schedule);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const generateSuggestions = (schedule) => {
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

    // Filter out past suggestions and sort by time
    const validSuggestions = suggestions
      .filter(s => s.time > now)
      .sort((a, b) => a.time - b.time);

    setSuggestions(validSuggestions);
  };

  // Refresh suggestions every minute
  useEffect(() => {
    if (schedule) {
      const interval = setInterval(() => {
        generateSuggestions(schedule);
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [schedule]);

  return {
    suggestions,
    refreshSuggestions: () => schedule && generateSuggestions(schedule),
  };
};
