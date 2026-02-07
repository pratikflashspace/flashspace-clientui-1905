import { dummyNotifications, Notification, notificationPreferences, NotificationPreferences } from './notificationData';

type NotificationInput = Omit<Notification, 'id' | 'timestamp'> & { id?: string };

type NotificationTemplates = {
  [K in Notification['type']]: {
    title: string;
    message: string;
    icon: string;
    priority: Notification['priority'];
  };
};

class NotificationService {
  private notifications: Notification[] = [...dummyNotifications];
  private preferences: NotificationPreferences = { ...notificationPreferences };

  // Get all notifications
  getAllNotifications(): Notification[] {
    return this.notifications.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  // Get unread count (for badge)
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
  }

  // Delete notification
  deleteNotification(notificationId: string): void {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications = [];
  }

  // Get notification preferences
  getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  // Update preferences
  updatePreferences(newPreferences: Partial<NotificationPreferences>): NotificationPreferences {
    this.preferences = { ...this.preferences, ...newPreferences };
    return this.preferences;
  }

  // Get notifications by type
  getNotificationsByType(type: Notification['type']): Notification[] {
    return this.notifications.filter(n => n.type === type);
  }

  // Add a new notification (for simulating new notifications)
  addNotification(notificationInput: NotificationInput): Notification {
    const newNotification: Notification = {
      ...notificationInput,
      id: notificationInput.id || `notif_${Date.now()}`,
      timestamp: new Date()
    };
    this.notifications.unshift(newNotification);
    return newNotification;
  }

  // Notification templates for simulation
  private templates: NotificationTemplates = {
    payment: {
      title: 'Payment Reminder',
      message: 'Your monthly subscription payment is due in 3 days',
      icon: '💰',
      priority: 'high'
    },
    mail: {
      title: 'New Mail',
      message: 'A registered letter has arrived at your office',
      icon: '✉️',
      priority: 'medium'
    },
    visit: {
      title: 'Visitor Alert',
      message: 'A guest has checked in at your workspace',
      icon: '👥',
      priority: 'medium'
    },
    booking: {
      title: 'Booking Update',
      message: 'Your meeting room booking for tomorrow is confirmed',
      icon: '📅',
      priority: 'medium'
    },
    document: {
      title: 'Document Action Required',
      message: 'Please review and sign the updated agreement',
      icon: '📋',
      priority: 'high'
    },
    system: {
      title: 'System Update',
      message: 'New features have been added to your dashboard',
      icon: '⚙️',
      priority: 'low'
    },
    support: {
      title: 'Support Response',
      message: 'Your support request has been addressed',
      icon: '💬',
      priority: 'medium'
    }
  };

  // Simulate receiving new notifications
  simulateNewNotification(): Notification {
    const types: Notification['type'][] = ['payment', 'mail', 'visit', 'booking', 'document'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    return this.addNotification({
      type,
      ...this.templates[type],
      isRead: false
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// For development/testing - add to window with proper typing
if (typeof window !== 'undefined') {
  interface Window {
    notificationService?: NotificationService;
  }
  
  (window as Window).notificationService = notificationService;
}

export default notificationService;