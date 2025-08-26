const express = require('express');
const router = express.Router();
const notificationSettingsService = require('../services/notificationSettingsService');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const internalService = require('../services/internalService');

// GET /api/notifications/settings - Get notification settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await notificationSettingsService.getSettings();
    res.json({ settings });
  } catch (error) {
    console.error('Error getting notification settings:', error);
    res.status(500).json({ 
      error: 'Failed to get notification settings',
      message: error.message 
    });
  }
});

// POST /api/notifications/settings - Save notification settings
router.post('/settings', async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!settings) {
      return res.status(400).json({ 
        error: 'Settings data is required' 
      });
    }

    await notificationSettingsService.saveSettings(settings);
    res.json({ 
      message: 'Notification settings saved successfully',
      settings 
    });
  } catch (error) {
    console.error('Error saving notification settings:', error);
    res.status(500).json({ 
      error: 'Failed to save notification settings',
      message: error.message 
    });
  }
});

// POST /api/notifications/test - Send test notifications
router.post('/test', async (req, res) => {
  try {
    const { type, settings, testEmail, testPhone } = req.body;
    
    if (!type || !settings) {
      return res.status(400).json({ 
        error: 'Type and settings are required' 
      });
    }

    const sentChannels = [];
    const errors = [];

    // Determine which notification types to test based on active tab
    const notificationTypes = type === 'customer' 
      ? ['returnReminders', 'paymentReminders', 'overdueAlerts', 'pickupReminders', 'orderConfirmation']
      : ['overdueAlerts']; // Internal notifications

    for (const notificationType of notificationTypes) {
      const notificationSettings = settings[notificationType];
      
      if (!notificationSettings || !notificationSettings.enabled) {
        continue;
      }

      // Test each enabled channel
      for (const channel of notificationSettings.channels) {
        try {
          switch (channel) {
            case 'email':
              if (testEmail) {
                await emailService.sendTestEmail(testEmail, notificationType, type);
                sentChannels.push('Email');
              }
              break;
            
            case 'sms':
              if (testPhone) {
                await smsService.sendTestSMS(testPhone, notificationType, type);
                sentChannels.push('SMS');
              }
              break;
            
            case 'internal':
              await internalService.sendTestNotification(notificationType, type);
              sentChannels.push('Internal');
              break;
          }
        } catch (error) {
          console.error(`Error sending ${channel} test notification:`, error);
          errors.push(`${channel}: ${error.message}`);
        }
      }
    }

    if (sentChannels.length === 0) {
      return res.status(400).json({ 
        error: 'No notifications were sent. Please check your settings and test credentials.' 
      });
    }

    res.json({ 
      message: 'Test notifications sent successfully',
      sentChannels: [...new Set(sentChannels)], // Remove duplicates
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error sending test notifications:', error);
    res.status(500).json({ 
      error: 'Failed to send test notifications',
      message: error.message 
    });
  }
});

// GET /api/notifications/history - Get notification history
router.get('/history', async (req, res) => {
  try {
    const { type, channel, days = 7 } = req.query;
    const history = await notificationSettingsService.getNotificationHistory(type, channel, days);
    res.json({ history });
  } catch (error) {
    console.error('Error getting notification history:', error);
    res.status(500).json({ 
      error: 'Failed to get notification history',
      message: error.message 
    });
  }
});

module.exports = router;
