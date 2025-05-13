import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storage } from '../infrastructure/storage/storage';

// Configure notifications for the app
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  async init() {
    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Set notification categories/actions
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('transition', [
        {
          identifier: 'start',
          buttonTitle: 'Start Transition',
          options: {
            isAuthenticationRequired: false,
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'skip',
          buttonTitle: 'Skip',
          options: {
            isDestructive: true,
            isAuthenticationRequired: false,
          },
        },
      ]);
    }

    return true;
  }

  async scheduleTransitionReminder(type, scheduledTime, settings) {
    const trigger = new Date(scheduledTime);
    trigger.setMinutes(trigger.getMinutes() - 5); // Notify 5 minutes before

    // Don't schedule if the time has passed
    if (trigger <= new Date()) {
      return null;
    }

    const notification = {
      content: {
        title: 'Mindful Transition Coming Up',
        body: this.getNotificationBody(type),
        sound: settings?.audio?.enabled ? 'notification.wav' : null,
        badge: 1,
        data: { type },
        categoryIdentifier: 'transition',
      },
      trigger,
    };

    try {
      const id = await Notifications.scheduleNotificationAsync(notification);
      await this.saveScheduledNotification(id, type, scheduledTime);
      return id;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  getNotificationBody(type) {
    const messages = {
      'work-to-break': 'Time for a mindful break from work',
      'break-to-work': 'Prepare to return to work mindfully',
      'morning-start': 'Start your day with intention',
      'evening-wind-down': 'Time to wind down your workday',
    };
    return messages[type] || 'Time for your mindful transition';
  }

  async saveScheduledNotification(id, type, scheduledTime) {
    try {
      const notifications = await storage.getItem('scheduledNotifications') || {};
      notifications[id] = {
        type,
        scheduledTime,
        createdAt: new Date().toISOString(),
      };
      await storage.setItem('scheduledNotifications', notifications);
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  async cancelNotification(id) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      const notifications = await storage.getItem('scheduledNotifications') || {};
      delete notifications[id];
      await storage.setItem('scheduledNotifications', notifications);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await storage.setItem('scheduledNotifications', {});
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  setupListeners(onNotification, onNotificationResponse) {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      onNotification
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponse
    );

    return () => {
      this.notificationListener?.remove();
      this.responseListener?.remove();
    };
  }
}

export const notificationService = new NotificationService();
