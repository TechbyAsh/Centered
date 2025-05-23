import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state based on the specification
const initialState = {
  completed: false,
  currentStep: 0,
  schedule: {
    workStartTime: '09:00',
    workEndTime: '17:00',
    lunchTime: '12:30',
    additionalBreaks: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  pausePreferences: {
    includeBreathing: true,
    includeSoundscapes: true,
    includeMeditations: false,
    includeRituals: false,
    favoriteTypes: [],
  },
  notificationPreferences: {
    enableHaptic: true,
    enableSound: true,
    enableVisual: true,
    frequency: 5, // 1-10 scale
    blackoutPeriods: [],
  },
  permissionsGranted: {
    notifications: false,
    calendar: false,
    healthKit: false,
  },
};

// Create context
const OnboardingContext = createContext();

// Storage key
const STORAGE_KEY = '@PauseApp:onboarding';

export const OnboardingProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(true);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedState) {
          setState(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Failed to load onboarding state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, []);

  // Save state changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save onboarding state:', error);
      }
    };

    if (!loading) {
      saveState();
    }
  }, [state, loading]);

  // Update schedule
  const updateSchedule = (updates) => {
    setState((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        ...updates,
      },
    }));
  };

  // Update pause preferences
  const updatePausePreferences = (updates) => {
    setState((prev) => ({
      ...prev,
      pausePreferences: {
        ...prev.pausePreferences,
        ...updates,
      },
    }));
  };

  // Update notification preferences
  const updateNotificationPreferences = (updates) => {
    setState((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        ...updates,
      },
    }));
  };

  // Update permissions
  const updatePermissions = (updates) => {
    setState((prev) => ({
      ...prev,
      permissionsGranted: {
        ...prev.permissionsGranted,
        ...updates,
      },
    }));
  };

  // Go to next step
  const nextStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: prev.currentStep + 1,
    }));
  };

  // Go to previous step
  const prevStep = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  };

  // Go to specific step
  const goToStep = (step) => {
    setState((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  // Complete onboarding
  const completeOnboarding = () => {
    setState((prev) => ({
      ...prev,
      completed: true,
    }));
  };

  // Reset onboarding (for testing)
  const resetOnboarding = () => {
    setState(initialState);
  };

  // Context value
  const value = {
    ...state,
    loading,
    updateSchedule,
    updatePausePreferences,
    updateNotificationPreferences,
    updatePermissions,
    nextStep,
    prevStep,
    goToStep,
    completeOnboarding,
    resetOnboarding,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Custom hook for using the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
