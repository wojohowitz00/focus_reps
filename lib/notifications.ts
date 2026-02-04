/**
 * Notification scheduling and management
 * Handles daily practice reminders and notifications
 */

import * as Notifications from 'expo-notifications';
import { getSettings } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Schedule daily practice reminder
 */
export async function scheduleDailyReminder(time: string = '08:00'): Promise<string | null> {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.warn('Notification permissions not granted');
      return null;
    }

    // Cancel existing daily reminders
    await cancelDailyReminders();

    const [hours, minutes] = time.split(':').map(Number);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time for Your Practice 🌱',
        body: 'Take 12 minutes to strengthen your attention with mindfulness practice.',
        sound: true,
        data: { type: 'daily_reminder' },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
    return null;
  }
}

export async function cancelDailyReminders(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const dailyIds = scheduled
      .filter((item) => item.content.data?.type === 'daily_reminder')
      .map((item) => item.identifier);

    await Promise.all(dailyIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  } catch (error) {
    console.error('Error canceling daily reminders:', error);
  }
}

/**
 * Schedule streak maintenance reminder
 */
export async function scheduleStreakReminder(streakDays: number): Promise<string | null> {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return null;
    }

    // Schedule reminder for tomorrow if streak is active
    if (streakDays > 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20, 0, 0); // 8 PM reminder

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `Don't Break Your ${streakDays}-Day Streak! 🔥`,
          body: 'Keep your mindfulness practice going strong.',
          sound: true,
          data: { type: 'streak_reminder' },
        },
        trigger: {
          date: tomorrow,
        },
      });

      return notificationId;
    }

    return null;
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
    return null;
  }
}

/**
 * Schedule weekly summary notification
 */
export async function scheduleWeeklySummary(
  totalSessions: number,
  totalMinutes: number
): Promise<string | null> {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weekly Practice Summary 📊',
        body: `You completed ${totalSessions} sessions and practiced ${totalMinutes} minutes this week. Great work!`,
        sound: true,
        data: { type: 'weekly_summary' },
      },
      trigger: {
        weekday: 1,
        hour: 19,
        minute: 0,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('Error scheduling weekly summary:', error);
    return null;
  }
}

export async function scheduleWeeklyReminder(
  day: number,
  time: string
): Promise<string | null> {
  try {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      return null;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const weekday = Math.min(Math.max(day, 0), 6) + 1; // Notifications uses 1-7

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Weekly Review Ready 📈',
        body: 'Your Focus Reps weekly review is ready. Take a look and set your next target.',
        sound: true,
        data: { type: 'weekly_reminder' },
      },
      trigger: {
        weekday,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling weekly reminder:', error);
    return null;
  }
}

export async function cancelWeeklyReminder(): Promise<void> {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const weeklyIds = scheduled
      .filter((item) => item.content.data?.type === 'weekly_reminder')
      .map((item) => item.identifier);

    await Promise.all(weeklyIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  } catch (error) {
    console.error('Error canceling weekly reminder:', error);
  }
}

/**
 * Cancel all scheduled reminders
 */
export async function cancelAllReminders(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling reminders:', error);
  }
}

/**
 * Cancel a specific reminder
 */
export async function cancelReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Error canceling reminder:', error);
  }
}

/**
 * Reschedule reminder with new time
 */
export async function rescheduleReminder(newTime: string): Promise<string | null> {
  await cancelDailyReminders();
  return await scheduleDailyReminder(newTime);
}

/**
 * Initialize notifications based on user settings
 */
export async function initializeNotifications(): Promise<void> {
  try {
    const settings = await getSettings();
    
    if (settings?.notificationsEnabled && settings?.reminderTime) {
      await scheduleDailyReminder(settings.reminderTime);
    }

    if (settings?.weeklyReminderEnabled) {
      await scheduleWeeklyReminder(settings.weeklyReminderDay, settings.weeklyReminderTime);
    }
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
}
