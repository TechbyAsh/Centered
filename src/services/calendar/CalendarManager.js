import React from 'react';
import { GoogleCalendarProvider } from './providers/GoogleCalendar';
import { AppleCalendarProvider } from './providers/AppleCalendar';
import { OutlookCalendarProvider } from './providers/OutlookCalendar';
import { CalendarStorage } from './CalendarStorage';

const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

// Create context using React.createContext
const CalendarManagerContext = React.createContext(null);

// Create a singleton instance
let instance = null;

class CalendarManager {  
  static getInstance() {
    if (!instance) {
      instance = new CalendarManager();
    }
    return instance;
  }

  static resetInstance() {
    instance = null;
  }

  constructor() {
    if (instance) {
      throw new Error('Use CalendarManager.getInstance()');
    }

    this.providers = {};
    this.activeProviders = [];
    instance = this;
  }

  async initializeProvider(providerId) {
    if (!this.providers[providerId]) {
      switch (providerId) {
        case 'google':
          this.providers[providerId] = new GoogleCalendarProvider();
          break;
        case 'apple':
          this.providers[providerId] = new AppleCalendarProvider();
          break;
        case 'outlook':
          this.providers[providerId] = new OutlookCalendarProvider();
          break;
        default:
          throw new Error(`Unknown provider: ${providerId}`);
      }
    }
    return this.providers[providerId];
  }

  async initialize() {
    try {
      // Load active providers from storage
      this.activeProviders = await CalendarStorage.getActiveProviders();

      // Initialize each active provider
      for (const providerId of this.activeProviders) {
        const provider = await this.initializeProvider(providerId);
        await provider.initialize();
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize calendar manager:', error);
      return false;
    }
  }

  async activateProvider(providerId, authToken = null) {
    try {
      // Initialize provider if needed
      const provider = await this.initializeProvider(providerId);
      
      // Initialize the provider
      const initialized = await provider.initialize();
      
      // For OAuth providers (Google, Outlook), use the provided auth token
      if (authToken && (providerId === 'google' || providerId === 'outlook')) {
        provider.setAccessToken(authToken);
      } else if (!initialized) {
        // For Apple Calendar or if no token provided, try direct authentication
        const authenticated = await provider.authenticate();
        if (!authenticated) {
          throw new Error(`Failed to authenticate with ${providerId}`);
        }
      }

      // Add to active providers if not already active
      if (!this.activeProviders.includes(providerId)) {
        this.activeProviders.push(providerId);
        await CalendarStorage.setActiveProviders(this.activeProviders);
      }

      return true;
    } catch (error) {
      console.error(`Failed to activate ${providerId}:`, error);
      return false;
    }
  }

  async deactivateProvider(providerId) {
    try {
      const provider = this.providers[providerId];
      if (!provider) {
        // If provider wasn't initialized, nothing to deactivate
        return true;
      }

      // Disconnect the provider
      await provider.disconnect();

      // Remove from active providers and providers list
      this.activeProviders = this.activeProviders.filter(id => id !== providerId);
      delete this.providers[providerId];
      await CalendarStorage.setActiveProviders(this.activeProviders);

      return true;
    } catch (error) {
      console.error(`Failed to deactivate ${providerId}:`, error);
      return false;
    }
  }

  async getEvents(startDate, endDate) {
    try {
      // Check cache first
      const cachedData = await CalendarStorage.getCachedEvents();
      const lastSync = await CalendarStorage.getLastSyncTime();
      const now = new Date().getTime();

      if (cachedData && lastSync && (now - parseInt(lastSync) < SYNC_INTERVAL)) {
        return this.filterEventsByDateRange(cachedData, startDate, endDate);
      }

      // Fetch fresh data from all active providers
      const allEvents = [];
      for (const providerId of this.activeProviders) {
        try {
          // Initialize provider if needed
          const provider = await this.initializeProvider(providerId);
          const events = await provider.getEvents(startDate, endDate);
          allEvents.push(...events);
        } catch (error) {
          console.error(`Failed to fetch events from ${providerId}:`, error);
        }
      }

      // Sort events by start time
      const sortedEvents = allEvents.sort((a, b) => 
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );

      // Cache the results
      await CalendarStorage.cacheEvents(sortedEvents);
      await CalendarStorage.setLastSyncTime(now);

      return sortedEvents;
    } catch (error) {
      console.error('Failed to get events:', error);
      // Return cached data as fallback
      const cachedData = await CalendarStorage.getCachedEvents();
      return cachedData ? this.filterEventsByDateRange(cachedData, startDate, endDate) : [];
    }
  }

  filterEventsByDateRange(events, startDate, endDate) {
    return events.filter(event => {
      const eventStart = new Date(event.startDate).getTime();
      const eventEnd = new Date(event.endDate).getTime();
      return eventStart >= startDate.getTime() && eventEnd <= endDate.getTime();
    });
  }

  async clearCache() {
    try {
      await CalendarStorage.cacheEvents(null);
      await CalendarStorage.setLastSyncTime(null);
    } catch (error) {
      console.error('Failed to clear calendar cache:', error);
    }
  }

  getActiveProviders() {
    return this.activeProviders;
  }

  isProviderActive(providerId) {
    return this.activeProviders.includes(providerId);
  }

  getProvider(providerId) {
    return this.providers[providerId];
  }
}

// Calendar Manager Provider component
export function CalendarManagerProvider({ children }) {
  const [manager] = React.useState(() => CalendarManager.getInstance());
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    const initializeManager = async () => {
      try {
        // Initialize the manager if needed
        await manager.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize CalendarManager:', error);
      }
    };
    
    initializeManager();
    
    return () => {
      // Clean up if needed
    };
  }, [manager]);
  
  return (
    <CalendarManagerContext.Provider value={{ manager, isInitialized }}>
      {children}
    </CalendarManagerContext.Provider>
  );
}

// Custom hook to use the calendar manager
export function useCalendarManager() {
  const context = React.useContext(CalendarManagerContext);
  if (!context) {
    throw new Error('useCalendarManager must be used within a CalendarManagerProvider');
  }
  return context;
}

// Export the class
export { CalendarManager };
