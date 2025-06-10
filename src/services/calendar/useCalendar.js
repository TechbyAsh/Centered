import { useState, useEffect, useCallback } from 'react';
import { CalendarManager } from './CalendarManager';

export function useCalendar() {
  const [activeProviders, setActiveProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get singleton instance
  const manager = CalendarManager.getInstance();

  // Initialize on mount
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        await manager.initialize();
        if (mounted) {
          setActiveProviders(manager.activeProviders);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const activateProvider = useCallback(async (providerId, authToken = null) => {
    try {
      setError(null);
      const success = await manager.activateProvider(providerId, authToken);
      if (success) {
        setActiveProviders([...manager.activeProviders]);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const deactivateProvider = useCallback(async (providerId) => {
    try {
      setError(null);
      const success = await manager.deactivateProvider(providerId);
      if (success) {
        setActiveProviders([...manager.activeProviders]);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  const getEvents = useCallback(async (startDate, endDate) => {
    try {
      setError(null);
      return await manager.getEvents(startDate, endDate);
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  return {
    activeProviders,
    isLoading,
    error,
    activateProvider,
    deactivateProvider,
    getEvents
  };
}
