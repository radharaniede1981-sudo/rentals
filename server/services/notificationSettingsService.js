const fs = require('fs').promises;
const path = require('path');

// In a real application, you would use a proper database
// For this example, we'll use a JSON file to simulate database storage
const SETTINGS_FILE = path.join(__dirname, '../data/notification-settings.json');
const HISTORY_FILE = path.join(__dirname, '../data/notification-history.json');

// Ensure data directory exists
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(SETTINGS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Default notification settings
const defaultSettings = {
  returnReminders: {
    enabled: true,
    leadTime: 3,
    channels: ['email', 'sms'],
    customerEnabled: true,
    internalEnabled: true
  },
  paymentReminders: {
    enabled: true,
    leadTime: 7,
    channels: ['email'],
    customerEnabled: true,
    internalEnabled: false
  },
  overdueAlerts: {
    enabled: true,
    leadTime: 1,
    channels: ['email', 'sms', 'internal'],
    customerEnabled: true,
    internalEnabled: true
  },
  pickupReminders: {
    enabled: true,
    leadTime: 1,
    channels: ['email', 'sms'],
    customerEnabled: true,
    internalEnabled: true
  },
  orderConfirmation: {
    enabled: true,
    channels: ['email'],
    customerEnabled: true,
    internalEnabled: true
  }
};

class NotificationSettingsService {
  async getSettings() {
    try {
      await ensureDataDirectory();
      
      try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        // If file doesn't exist, return default settings
        if (error.code === 'ENOENT') {
          await this.saveSettings(defaultSettings);
          return defaultSettings;
        }
        throw error;
      }
    } catch (error) {
      console.error('Error reading notification settings:', error);
      // Return default settings as fallback
      return defaultSettings;
    }
  }

  async saveSettings(settings) {
    try {
      await ensureDataDirectory();
      await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      
      // Log the settings change
      await this.logNotificationEvent('settings_updated', {
        timestamp: new Date().toISOString(),
        action: 'settings_saved',
        settings: Object.keys(settings)
      });
      
      return true;
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw new Error('Failed to save notification settings');
    }
  }

  async getNotificationHistory(type = null, channel = null, days = 7) {
    try {
      await ensureDataDirectory();
      
      try {
        const data = await fs.readFile(HISTORY_FILE, 'utf8');
        let history = JSON.parse(data);
        
        // Filter by type if specified
        if (type) {
          history = history.filter(item => item.type === type);
        }
        
        // Filter by channel if specified
        if (channel) {
          history = history.filter(item => item.channel === channel);
        }
        
        // Filter by date range
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        
        history = history.filter(item => {
          const itemDate = new Date(item.timestamp);
          return itemDate >= cutoffDate;
        });
        
        return history;
      } catch (error) {
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') {
          return [];
        }
        throw error;
      }
    } catch (error) {
      console.error('Error reading notification history:', error);
      return [];
    }
  }

  async logNotificationEvent(type, data) {
    try {
      await ensureDataDirectory();
      
      let history = [];
      try {
        const data = await fs.readFile(HISTORY_FILE, 'utf8');
        history = JSON.parse(data);
      } catch (error) {
        // If file doesn't exist, start with empty array
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }
      
      const event = {
        id: Date.now(),
        type,
        timestamp: new Date().toISOString(),
        ...data
      };
      
      history.unshift(event); // Add to beginning of array
      
      // Keep only last 1000 events to prevent file from growing too large
      if (history.length > 1000) {
        history = history.slice(0, 1000);
      }
      
      await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
    } catch (error) {
      console.error('Error logging notification event:', error);
      // Don't throw error for logging failures
    }
  }

  async logNotificationSent(notificationType, channel, recipient, content, status = 'sent') {
    await this.logNotificationEvent('notification_sent', {
      notificationType,
      channel,
      recipient,
      content: content.substring(0, 100), // Truncate content for storage
      status,
      timestamp: new Date().toISOString()
    });
  }

  async logNotificationError(notificationType, channel, recipient, error) {
    await this.logNotificationEvent('notification_error', {
      notificationType,
      channel,
      recipient,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new NotificationSettingsService();
