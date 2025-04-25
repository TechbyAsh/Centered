import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_PREFERENCES: '@centered_preferences',
  SESSION_HISTORY: '@centered_sessions',
  STREAK_DATA: '@centered_streaks',
  WEEKLY_STATS: '@centered_weekly_stats',
};

export const storage = {
  async savePreferences(preferences) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving preferences:', error);
      return false;
    }
  },

  async getPreferences() {
    try {
      const preferences = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  },

  async saveSession(session) {
    try {
      const sessions = await this.getSessions();
      const updatedSessions = [session, ...sessions];
      await AsyncStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(updatedSessions));
      return true;
    } catch (error) {
      console.error('Error saving session:', error);
      return false;
    }
  },

  async getSessions() {
    try {
      const sessions = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  async updateStreak(streakData) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
      return true;
    } catch (error) {
      console.error('Error updating streak:', error);
      return false;
    }
  },

  async getStreak() {
    try {
      const streak = await AsyncStorage.getItem(STORAGE_KEYS.STREAK_DATA);
      return streak ? JSON.parse(streak) : { current: 0, lastSessionDate: null };
    } catch (error) {
      console.error('Error getting streak:', error);
      return { current: 0, lastSessionDate: null };
    }
  },

  async updateWeeklyStats(stats) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_STATS, JSON.stringify(stats));
      return true;
    } catch (error) {
      console.error('Error updating weekly stats:', error);
      return false;
    }
  },

  async getWeeklyStats() {
    try {
      const stats = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_STATS);
      return stats ? JSON.parse(stats) : {
        totalMinutes: 0,
        sessionsCompleted: 0,
        weeklyData: Array(7).fill(0),
      };
    } catch (error) {
      console.error('Error getting weekly stats:', error);
      return {
        totalMinutes: 0,
        sessionsCompleted: 0,
        weeklyData: Array(7).fill(0),
      };
    }
  },
};
