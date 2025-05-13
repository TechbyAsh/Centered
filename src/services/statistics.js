import { storage } from '../infrastructure/storage/storage';

class StatisticsService {
  constructor() {
    this.stats = {
      transitions: [],
      streaks: {
        current: 0,
        longest: 0,
        lastCompleted: null,
      },
      weeklyGoals: {
        target: 15, // Default weekly transition goal
        progress: 0,
      },
      totalDuration: 0,
      typeBreakdown: {},
      timeOfDayBreakdown: {},
    };
  }

  async init() {
    try {
      const savedStats = await storage.getItem('transitionStats');
      if (savedStats) {
        this.stats = { ...this.stats, ...savedStats };
      }
      return true;
    } catch (error) {
      console.error('Error initializing statistics:', error);
      return false;
    }
  }

  async recordTransition(transition) {
    try {
      const {
        type,
        startTime,
        duration,
        completed,
        skipped,
      } = transition;

      const transitionData = {
        id: Date.now().toString(),
        type,
        startTime: new Date(startTime).toISOString(),
        duration,
        completed,
        skipped,
        timeOfDay: this.getTimeOfDay(new Date(startTime)),
      };

      // Add to transitions history
      this.stats.transitions.push(transitionData);

      // Update type breakdown
      this.stats.typeBreakdown[type] = (this.stats.typeBreakdown[type] || 0) + 1;

      // Update time of day breakdown
      this.stats.timeOfDayBreakdown[transitionData.timeOfDay] = 
        (this.stats.timeOfDayBreakdown[transitionData.timeOfDay] || 0) + 1;

      if (completed) {
        // Update total duration
        this.stats.totalDuration += duration;

        // Update streak
        this.updateStreak(startTime);

        // Update weekly progress
        this.updateWeeklyProgress();
      }

      await this.saveStats();
      return transitionData;
    } catch (error) {
      console.error('Error recording transition:', error);
      return null;
    }
  }

  updateStreak(startTime) {
    const today = new Date(startTime).toDateString();
    const lastCompleted = this.stats.streaks.lastCompleted 
      ? new Date(this.stats.streaks.lastCompleted).toDateString()
      : null;

    if (!lastCompleted) {
      // First completion
      this.stats.streaks.current = 1;
    } else if (today === lastCompleted) {
      // Already counted for today
      return;
    } else {
      const daysDiff = this.getDaysDifference(
        new Date(lastCompleted),
        new Date(today)
      );

      if (daysDiff === 1) {
        // Consecutive day
        this.stats.streaks.current += 1;
      } else {
        // Streak broken
        this.stats.streaks.current = 1;
      }
    }

    // Update longest streak
    if (this.stats.streaks.current > this.stats.streaks.longest) {
      this.stats.streaks.longest = this.stats.streaks.current;
    }

    this.stats.streaks.lastCompleted = new Date(startTime).toISOString();
  }

  updateWeeklyProgress() {
    const today = new Date();
    const weekStart = this.getStartOfWeek(today);
    
    // Reset progress if it's a new week
    if (!this.stats.weeklyGoals.weekStartDate || 
        new Date(this.stats.weeklyGoals.weekStartDate) < weekStart) {
      this.stats.weeklyGoals.progress = 0;
      this.stats.weeklyGoals.weekStartDate = weekStart.toISOString();
    }

    this.stats.weeklyGoals.progress += 1;
  }

  getTimeOfDay(date) {
    const hour = date.getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  getStartOfWeek(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    result.setDate(result.getDate() - result.getDay());
    return result;
  }

  async getStats(timeRange = '7d') {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    const filteredTransitions = this.stats.transitions.filter(
      t => new Date(t.startTime) >= startDate
    );

    return {
      transitions: filteredTransitions,
      streaks: this.stats.streaks,
      weeklyGoals: this.stats.weeklyGoals,
      summary: {
        total: filteredTransitions.length,
        completed: filteredTransitions.filter(t => t.completed).length,
        skipped: filteredTransitions.filter(t => t.skipped).length,
        totalDuration: filteredTransitions.reduce(
          (sum, t) => sum + (t.completed ? t.duration : 0),
          0
        ),
      },
      typeBreakdown: this.calculateBreakdown(
        filteredTransitions,
        t => t.type
      ),
      timeOfDayBreakdown: this.calculateBreakdown(
        filteredTransitions,
        t => this.getTimeOfDay(new Date(t.startTime))
      ),
    };
  }

  calculateBreakdown(transitions, keyFn) {
    const breakdown = {};
    transitions.forEach(t => {
      const key = keyFn(t);
      breakdown[key] = (breakdown[key] || 0) + 1;
    });
    return breakdown;
  }

  async setWeeklyGoal(target) {
    this.stats.weeklyGoals.target = target;
    await this.saveStats();
  }

  async saveStats() {
    try {
      await storage.setItem('transitionStats', this.stats);
    } catch (error) {
      console.error('Error saving statistics:', error);
    }
  }

  async resetStats() {
    this.stats = {
      transitions: [],
      streaks: {
        current: 0,
        longest: 0,
        lastCompleted: null,
      },
      weeklyGoals: {
        target: 15,
        progress: 0,
      },
      totalDuration: 0,
      typeBreakdown: {},
      timeOfDayBreakdown: {},
    };
    await this.saveStats();
  }
}

export const statistics = new StatisticsService();
