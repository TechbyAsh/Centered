import AsyncStorage from '@react-native-async-storage/async-storage';

const TIME_BLOCKS = {
  EARLY_MORNING: 'EARLY_MORNING',
  MORNING: 'MORNING',
  LUNCH: 'LUNCH',
  AFTERNOON: 'AFTERNOON',
  EVENING: 'EVENING',
  NIGHT: 'NIGHT'
};

const ACTIVITY_TYPES = {
  BREATHE: 'Breathe',
  MEDITATE: 'Meditate',
  RELAX: 'Relax',
  RITUAL: 'Ritual'
};

// Activity recommendations for each time block
const timeBlockRecommendations = {
  [TIME_BLOCKS.EARLY_MORNING]: {
    primary: {
      type: ACTIVITY_TYPES.RITUAL,
      name: 'Morning Reset',
      description: 'Start your day mindfully',
      duration: '10-15 min'
    },
    secondary: {
      type: ACTIVITY_TYPES.BREATHE,
      name: 'Energizing Breath',
      description: 'Boost your morning energy',
      duration: '5 min'
    }
  },
  [TIME_BLOCKS.MORNING]: {
    primary: {
      type: ACTIVITY_TYPES.MEDITATE,
      name: 'Quick Calm',
      description: 'Center yourself before work',
      duration: '3 min'
    },
    secondary: {
      type: ACTIVITY_TYPES.BREATHE,
      name: 'Focus Breath',
      description: 'Enhance your concentration',
      duration: '2 min'
    }
  },
  [TIME_BLOCKS.LUNCH]: {
    primary: {
      type: ACTIVITY_TYPES.RITUAL,
      name: 'Afternoon Refresh',
      description: 'Reset during your break',
      duration: '5-7 min'
    },
    secondary: {
      type: ACTIVITY_TYPES.RELAX,
      name: 'Quick Unwind',
      description: 'Brief relaxation',
      duration: '5 min'
    }
  },
  [TIME_BLOCKS.AFTERNOON]: {
    primary: {
      type: ACTIVITY_TYPES.BREATHE,
      name: 'Afternoon Revival',
      description: 'Combat the afternoon slump',
      duration: '3 min'
    },
    secondary: {
      type: ACTIVITY_TYPES.MEDITATE,
      name: 'Mindful Break',
      description: 'Regain focus and clarity',
      duration: '5 min'
    }
  },
  [TIME_BLOCKS.EVENING]: {
    primary: {
      type: ACTIVITY_TYPES.RITUAL,
      name: 'Evening Unwind',
      description: 'Transition from work mode',
      duration: '15-20 min'
    },
    secondary: {
      type: ACTIVITY_TYPES.RELAX,
      name: 'Evening Sounds',
      description: 'Calming soundscape',
      duration: '10 min'
    }
  },
  [TIME_BLOCKS.NIGHT]: {
    primary: {
      type: ACTIVITY_TYPES.RITUAL,
      name: 'Night Wind Down',
      description: 'Prepare for restful sleep',
      duration: '10-12 min'
    },
    secondary: {
      type: ACTIVITY_TYPES.BREATHE,
      name: 'Sleep Ready',
      description: 'Calming breath work',
      duration: '5 min'
    }
  }
};

// Helper to parse time string to minutes since midnight
const timeToMinutes = (timeString) => {
  const date = new Date(timeString);
  return date.getHours() * 60 + date.getMinutes();
};

// Get current time block based on user's schedule or time of day
const getCurrentTimeBlock = async () => {
  try {
    const scheduleStr = await AsyncStorage.getItem('userSchedule');
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // If no schedule, use default time blocks based on time of day
    if (!scheduleStr) {
      if (currentMinutes < 6 * 60) { // Before 6 AM
        return TIME_BLOCKS.NIGHT;
      } else if (currentMinutes < 9 * 60) { // 6 AM - 9 AM
        return TIME_BLOCKS.EARLY_MORNING;
      } else if (currentMinutes < 12 * 60) { // 9 AM - 12 PM
        return TIME_BLOCKS.MORNING;
      } else if (currentMinutes < 13 * 60) { // 12 PM - 1 PM
        return TIME_BLOCKS.LUNCH;
      } else if (currentMinutes < 17 * 60) { // 1 PM - 5 PM
        return TIME_BLOCKS.AFTERNOON;
      } else if (currentMinutes < 21 * 60) { // 5 PM - 9 PM
        return TIME_BLOCKS.EVENING;
      } else { // After 9 PM
        return TIME_BLOCKS.NIGHT;
      }
    }

    const schedule = JSON.parse(scheduleStr);


    const wakeMinutes = timeToMinutes(schedule.wakeTime);
    const workStartMinutes = timeToMinutes(schedule.workStartTime);
    const lunchMinutes = timeToMinutes(schedule.lunchTime);
    const workEndMinutes = timeToMinutes(schedule.workEndTime);
    const bedMinutes = timeToMinutes(schedule.bedTime);

    if (currentMinutes < wakeMinutes) {
      return TIME_BLOCKS.NIGHT;
    } else if (currentMinutes < workStartMinutes) {
      return TIME_BLOCKS.EARLY_MORNING;
    } else if (currentMinutes < lunchMinutes) {
      return TIME_BLOCKS.MORNING;
    } else if (currentMinutes < lunchMinutes + 60) { // Assume 1-hour lunch
      return TIME_BLOCKS.LUNCH;
    } else if (currentMinutes < workEndMinutes) {
      return TIME_BLOCKS.AFTERNOON;
    } else if (currentMinutes < bedMinutes) {
      return TIME_BLOCKS.EVENING;
    } else {
      return TIME_BLOCKS.NIGHT;
    }
  } catch (error) {
    console.error('Error getting current time block:', error);
    return null;
  }
};

// Get recommended activities for current time
export const getRecommendedActivities = async () => {
  const timeBlock = await getCurrentTimeBlock();
  if (!timeBlock) return null;

  return {
    timeBlock,
    ...timeBlockRecommendations[timeBlock]
  };
};

// Check if it's a good time for a specific activity
export const isGoodTimeFor = async (activityType) => {
  const recommendations = await getRecommendedActivities();
  if (!recommendations) return true; // If no schedule, any time is fine

  return (
    recommendations.primary.type === activityType ||
    recommendations.secondary.type === activityType
  );
};

// Get next best time for an activity
export const getNextBestTime = async (activityType) => {
  try {
    const scheduleStr = await AsyncStorage.getItem('userSchedule');
    if (!scheduleStr) return null;

    const schedule = JSON.parse(scheduleStr);
    const timeBlocks = Object.values(timeBlockRecommendations);
    
    for (const block of timeBlocks) {
      if (block.primary.type === activityType || block.secondary.type === activityType) {
        // Return the start time of this block based on schedule
        switch (block) {
          case timeBlockRecommendations[TIME_BLOCKS.EARLY_MORNING]:
            return new Date(schedule.wakeTime);
          case timeBlockRecommendations[TIME_BLOCKS.MORNING]:
            return new Date(schedule.workStartTime);
          case timeBlockRecommendations[TIME_BLOCKS.LUNCH]:
            return new Date(schedule.lunchTime);
          case timeBlockRecommendations[TIME_BLOCKS.AFTERNOON]:
            const lunch = new Date(schedule.lunchTime);
            lunch.setHours(lunch.getHours() + 1);
            return lunch;
          case timeBlockRecommendations[TIME_BLOCKS.EVENING]:
            return new Date(schedule.workEndTime);
          case timeBlockRecommendations[TIME_BLOCKS.NIGHT]:
            const evening = new Date(schedule.workEndTime);
            evening.setHours(evening.getHours() + 2);
            return evening;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting next best time:', error);
    return null;
  }
};
