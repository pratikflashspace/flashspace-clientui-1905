export interface Notification {
  id: string;
  type: 'payment' | 'mail' | 'visit' | 'booking' | 'document' | 'system' | 'support';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  icon: string;
  actionUrl?: string;
  data?: Record<string, string | number>; // More specific type
}

export const dummyNotifications: Notification[] = [
  {
    id: 'notif_001',
    type: 'payment',
    title: 'Payment Due',
    message: 'Your virtual office renewal payment of ₹15,000 is due on Feb 15, 2024',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    priority: 'high',
    icon: '💰',
    actionUrl: '/dashboard/payments',
    data: { amount: 15000, dueDate: '2024-02-15' }
  },
  {
    id: 'notif_002',
    type: 'mail',
    title: 'Mail Received',
    message: 'A new parcel from HDFC Bank has been received at your Mumbai BKC office',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    priority: 'medium',
    icon: '📦',
    actionUrl: '/dashboard/mail-records',
    data: { sender: 'HDFC Bank', location: 'Mumbai BKC', type: 'parcel' }
  },
  {
    id: 'notif_003',
    type: 'visit',
    title: 'Visitor Logged',
    message: 'A visitor (GST Officer) was logged at your office for official verification',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: false,
    priority: 'medium',
    icon: '👤',
    actionUrl: '/dashboard/visit-records',
    data: { visitorName: 'GST Officer', purpose: 'official verification' }
  },
  {
    id: 'notif_004',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Your payment of ₹800 for Day Pass booking has been processed successfully',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isRead: true,
    priority: 'low',
    icon: '✅',
    actionUrl: '/dashboard/payments',
    data: { amount: 800, bookingType: 'Day Pass' }
  },
  {
    id: 'notif_005',
    type: 'document',
    title: 'Document Verified',
    message: 'Your GST Registration document has been verified successfully',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    isRead: true,
    priority: 'low',
    icon: '📄',
    actionUrl: '/dashboard/documents',
    data: { documentType: 'GST Registration' }
  },
  {
    id: 'notif_006',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your TechHub Virtual Office booking has been confirmed. Booking ID: BK-VO-2024-001',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    isRead: true,
    priority: 'medium',
    icon: '🏢',
    actionUrl: '/dashboard/my-bookings',
    data: { bookingId: 'BK-VO-2024-001', spaceName: 'TechHub Virtual Office' }
  },
  {
    id: 'notif_007',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Feb 10, 2024 (10 PM - 2 AM). Services may be temporarily unavailable.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    isRead: true,
    priority: 'medium',
    icon: '⚙️',
    data: { maintenanceDate: '2024-02-10', time: '10 PM - 2 AM' }
  },
  {
    id: 'notif_008',
    type: 'support',
    title: 'Support Ticket Updated',
    message: 'Your support ticket #ST-7894 has been updated by our team',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    isRead: true,
    priority: 'low',
    icon: '💬',
    actionUrl: '/dashboard/support',
    data: { ticketId: 'ST-7894' }
  }
];

// User notification preferences
export interface NotificationPreferences {
  email: boolean;
  paymentAlerts: boolean;
  mailNotifications: boolean;
  visitAlerts: boolean;
  marketingUpdates: boolean;
  pushNotifications: boolean;
}

export const notificationPreferences: NotificationPreferences = {
  email: true,
  paymentAlerts: true,
  mailNotifications: true,
  visitAlerts: true,
  marketingUpdates: false,
  pushNotifications: true
};