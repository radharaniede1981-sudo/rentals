// For production, you might use Socket.io or a similar WebSocket library
// npm install socket.io
// const io = require('socket.io');

// Mock WebSocket service for development
class MockWebSocketService {
  constructor() {
    this.connectedClients = new Set();
    this.notifications = [];
  }

  // Simulate WebSocket connection
  connect(clientId) {
    this.connectedClients.add(clientId);
    console.log(`🔌 WebSocket client connected: ${clientId}`);
    return true;
  }

  // Simulate WebSocket disconnection
  disconnect(clientId) {
    this.connectedClients.delete(clientId);
    console.log(`🔌 WebSocket client disconnected: ${clientId}`);
  }

  // Simulate sending notification to all connected clients
  broadcastNotification(notification) {
    this.notifications.push(notification);
    console.log(`🔔 INTERNAL NOTIFICATION SENT:`, {
      type: notification.type,
      title: notification.title,
      message: notification.message,
      recipients: this.connectedClients.size,
      timestamp: new Date().toISOString()
    });
    
    // In production, this would be:
    // io.emit('notification', notification);
    
    return {
      success: true,
      recipients: this.connectedClients.size,
      notificationId: `internal-${Date.now()}`
    };
  }

  // Get recent notifications (for dashboard display)
  getRecentNotifications(limit = 50) {
    return this.notifications.slice(-limit);
  }

  // Mark notification as read
  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    }
    return notification;
  }
}

// Initialize WebSocket service
const wsService = new MockWebSocketService();

class InternalNotificationService {
  constructor() {
    this.wsService = wsService;
  }

  async sendTestNotification(notificationType, tabType) {
    try {
      const notification = this.createTestNotification(notificationType, tabType);
      
      const result = await this.wsService.broadcastNotification(notification);
      
      // Log the notification
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationSent(
        notificationType,
        'internal',
        'All Staff',
        notification.message
      );

      return result;
    } catch (error) {
      console.error('Error sending test internal notification:', error);
      
      // Log the error
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationError(
        notificationType,
        'internal',
        'All Staff',
        error
      );
      
      throw new Error(`Failed to send internal notification: ${error.message}`);
    }
  }

  async sendNotification(notificationType, data) {
    try {
      const notification = this.createNotification(notificationType, data);
      
      const result = await this.wsService.broadcastNotification(notification);
      
      // Log the notification
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationSent(
        notificationType,
        'internal',
        'All Staff',
        notification.message
      );

      return result;
    } catch (error) {
      console.error('Error sending internal notification:', error);
      
      // Log the error
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationError(
        notificationType,
        'internal',
        'All Staff',
        error
      );
      
      throw new Error(`Failed to send internal notification: ${error.message}`);
    }
  }

  createTestNotification(notificationType, tabType) {
    const notifications = {
      returnReminders: {
        id: `test-${Date.now()}`,
        type: 'warning',
        title: '[TEST] Return Reminder',
        message: `Test notification for return reminders (${tabType} tab). This is a test of the internal notification system.`,
        priority: 'medium',
        category: 'customer_service',
        timestamp: new Date().toISOString(),
        read: false
      },
      paymentReminders: {
        id: `test-${Date.now()}`,
        type: 'info',
        title: '[TEST] Payment Reminder',
        message: `Test notification for payment reminders (${tabType} tab). This is a test of the internal notification system.`,
        priority: 'medium',
        category: 'finance',
        timestamp: new Date().toISOString(),
        read: false
      },
      overdueAlerts: {
        id: `test-${Date.now()}`,
        type: 'error',
        title: '[TEST] Overdue Alert',
        message: `Test notification for overdue alerts (${tabType} tab). This is a test of the internal notification system.`,
        priority: 'high',
        category: 'urgent',
        timestamp: new Date().toISOString(),
        read: false
      },
      pickupReminders: {
        id: `test-${Date.now()}`,
        type: 'info',
        title: '[TEST] Pickup Reminder',
        message: `Test notification for pickup reminders (${tabType} tab). This is a test of the internal notification system.`,
        priority: 'medium',
        category: 'operations',
        timestamp: new Date().toISOString(),
        read: false
      },
      orderConfirmation: {
        id: `test-${Date.now()}`,
        type: 'success',
        title: '[TEST] Order Confirmation',
        message: `Test notification for order confirmations (${tabType} tab). This is a test of the internal notification system.`,
        priority: 'low',
        category: 'sales',
        timestamp: new Date().toISOString(),
        read: false
      }
    };

    return notifications[notificationType] || {
      id: `test-${Date.now()}`,
      type: 'info',
      title: '[TEST] Notification',
      message: `Test notification for ${notificationType} (${tabType} tab). This is a test of the internal notification system.`,
      priority: 'medium',
      category: 'general',
      timestamp: new Date().toISOString(),
      read: false
    };
  }

  createNotification(notificationType, data) {
    const notifications = {
      returnReminders: {
        id: `internal-${Date.now()}`,
        type: 'warning',
        title: 'Return Reminder Due',
        message: `Customer return reminder for order #${data.orderId} due in ${data.leadTime} days.`,
        priority: 'medium',
        category: 'customer_service',
        timestamp: new Date().toISOString(),
        read: false,
        data: data
      },
      paymentReminders: {
        id: `internal-${Date.now()}`,
        type: 'info',
        title: 'Payment Reminder Sent',
        message: `Payment reminder sent for order #${data.orderId} - $${data.amount} due.`,
        priority: 'medium',
        category: 'finance',
        timestamp: new Date().toISOString(),
        read: false,
        data: data
      },
      overdueAlerts: {
        id: `internal-${Date.now()}`,
        type: 'error',
        title: 'URGENT: Overdue Rental',
        message: `Order #${data.orderId} is now overdue! Customer needs immediate contact.`,
        priority: 'high',
        category: 'urgent',
        timestamp: new Date().toISOString(),
        read: false,
        data: data
      },
      pickupReminders: {
        id: `internal-${Date.now()}`,
        type: 'info',
        title: 'Pickup Scheduled',
        message: `Pickup reminder sent for order #${data.orderId} - scheduled for ${data.pickupDate}.`,
        priority: 'medium',
        category: 'operations',
        timestamp: new Date().toISOString(),
        read: false,
        data: data
      },
      orderConfirmation: {
        id: `internal-${Date.now()}`,
        type: 'success',
        title: 'New Order Confirmed',
        message: `Order #${data.orderId} confirmed! Total: $${data.amount}.`,
        priority: 'low',
        category: 'sales',
        timestamp: new Date().toISOString(),
        read: false,
        data: data
      }
    };

    return notifications[notificationType] || {
      id: `internal-${Date.now()}`,
      type: 'info',
      title: 'Notification',
      message: `Notification for ${notificationType} - Order #${data.orderId}.`,
      priority: 'medium',
      category: 'general',
      timestamp: new Date().toISOString(),
      read: false,
      data: data
    };
  }

  // Get recent notifications for dashboard
  getRecentNotifications(limit = 50) {
    return this.wsService.getRecentNotifications(limit);
  }

  // Mark notification as read
  markAsRead(notificationId) {
    return this.wsService.markAsRead(notificationId);
  }

  // Get unread notification count
  getUnreadCount() {
    const notifications = this.wsService.getRecentNotifications();
    return notifications.filter(n => !n.read).length;
  }

  // Get notifications by category
  getNotificationsByCategory(category) {
    const notifications = this.wsService.getRecentNotifications();
    return notifications.filter(n => n.category === category);
  }

  // Get notifications by priority
  getNotificationsByPriority(priority) {
    const notifications = this.wsService.getRecentNotifications();
    return notifications.filter(n => n.priority === priority);
  }
}

module.exports = new InternalNotificationService();
