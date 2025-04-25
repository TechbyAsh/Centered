import { useState, useEffect } from 'react';
import { storage } from '../infrastructure/storage/storage';

export const useDashboardData = () => {
  const [data, setData] = useState({
    weeklyMinutes: 0,
    sessionsCompleted: 0,
    currentStreak: 0,
    chartData: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [{
        data: [0, 0, 0, 0, 0, 0, 0]
      }]
    },
    recentSessions: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [stats, streakData, sessions] = await Promise.all([
        storage.getWeeklyStats(),
        storage.getStreak(),
        storage.getSessions()
      ]);

      setData({
        weeklyMinutes: stats.totalMinutes || 0,
        sessionsCompleted: stats.sessionsCompleted || 0,
        currentStreak: streakData.current || 0,
        chartData: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{
            data: stats.weeklyData || Array(7).fill(0)
          }]
        },
        recentSessions: sessions.slice(0, 5).map(session => ({
          id: session.id,
          type: session.type,
          duration: `${session.duration} min`,
          time: getTimeAgo(session.date),
          icon: getIconForSessionType(session.type)
        }))
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffHours = Math.floor((now - sessionDate) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return sessionDate.toLocaleDateString();
  };

  const getIconForSessionType = (type) => {
    switch (type.toLowerCase()) {
      case 'breathing':
      case 'breathe':
        return 'leaf-outline';
      case 'meditation':
      case 'relax':
        return 'moon-outline';
      case 'sleep':
        return 'bed-outline';
      default:
        return 'timer-outline';
    }
  };

  const addSession = async (sessionData) => {
    try {
      const session = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...sessionData
      };

      await storage.saveSession(session);
      
      // Update streak
      const currentDate = new Date().toDateString();
      const streakData = await storage.getStreak();
      if (streakData.lastSessionDate !== currentDate) {
        const lastDate = new Date(streakData.lastSessionDate);
        const isConsecutive = 
          !streakData.lastSessionDate || 
          (new Date(currentDate) - lastDate) <= (24 * 60 * 60 * 1000);
        
        await storage.updateStreak({
          current: isConsecutive ? streakData.current + 1 : 1,
          lastSessionDate: currentDate
        });
      }

      // Update weekly stats
      const stats = await storage.getWeeklyStats();
      const dayIndex = new Date().getDay();
      const weeklyData = [...stats.weeklyData];
      weeklyData[dayIndex] += sessionData.duration;

      await storage.updateWeeklyStats({
        totalMinutes: stats.totalMinutes + sessionData.duration,
        sessionsCompleted: stats.sessionsCompleted + 1,
        weeklyData
      });

      // Reload dashboard data
      await loadData();
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  return {
    ...data,
    addSession,
    refreshData: loadData
  };
};
