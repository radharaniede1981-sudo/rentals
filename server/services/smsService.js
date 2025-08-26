// For production, install: npm install twilio
// const twilio = require('twilio');

// Mock Twilio for development (replace with actual Twilio in production)
class MockTwilio {
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || 'mock-account-sid';
    this.authToken = process.env.TWILIO_AUTH_TOKEN || 'mock-auth-token';
    this.phoneNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  }

  async sendMessage(messageData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Log the SMS for development
    console.log('📱 SMS SENT:', {
      to: messageData.to,
      from: messageData.from,
      body: messageData.body,
      messageId: `mock-${Date.now()}`
    });

    // In production, this would be:
    // const client = twilio(this.accountSid, this.authToken);
    // return client.messages.create(messageData);
    
    return { 
      success: true, 
      sid: `mock-${Date.now()}`,
      status: 'delivered'
    };
  }
}

// Initialize Twilio
// const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioClient = new MockTwilio();

class SMSService {
  constructor() {
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  }

  async sendTestSMS(to, notificationType, tabType) {
    try {
      const content = this.getTestContent(notificationType, tabType);
      
      const messageData = {
        to,
        from: this.fromNumber,
        body: content
      };

      const result = await twilioClient.sendMessage(messageData);
      
      // Log the notification
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationSent(
        notificationType,
        'sms',
        to,
        content
      );

      return result;
    } catch (error) {
      console.error('Error sending test SMS:', error);
      
      // Log the error
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationError(
        notificationType,
        'sms',
        to,
        error
      );
      
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  async sendNotificationSMS(to, notificationType, data) {
    try {
      const content = this.getContent(notificationType, data);
      
      const messageData = {
        to,
        from: this.fromNumber,
        body: content
      };

      const result = await twilioClient.sendMessage(messageData);
      
      // Log the notification
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationSent(
        notificationType,
        'sms',
        to,
        content
      );

      return result;
    } catch (error) {
      console.error('Error sending notification SMS:', error);
      
      // Log the error
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationError(
        notificationType,
        'sms',
        to,
        error
      );
      
      throw new Error(`Failed to send SMS: ${error.message}`);
    }
  }

  getTestContent(notificationType, tabType) {
    const messages = {
      returnReminders: `[TEST] LeaseHub: Return reminder test for ${notificationType} (${tabType} tab). Sent at ${new Date().toLocaleString()}. Your SMS notifications are working!`,
      paymentReminders: `[TEST] LeaseHub: Payment reminder test for ${notificationType} (${tabType} tab). Sent at ${new Date().toLocaleString()}. Your SMS notifications are working!`,
      overdueAlerts: `[TEST] LeaseHub: Overdue alert test for ${notificationType} (${tabType} tab). Sent at ${new Date().toLocaleString()}. Your SMS notifications are working!`,
      pickupReminders: `[TEST] LeaseHub: Pickup reminder test for ${notificationType} (${tabType} tab). Sent at ${new Date().toLocaleString()}. Your SMS notifications are working!`,
      orderConfirmation: `[TEST] LeaseHub: Order confirmation test for ${notificationType} (${tabType} tab). Sent at ${new Date().toLocaleString()}. Your SMS notifications are working!`
    };
    
    return messages[notificationType] || `[TEST] LeaseHub: Test notification for ${notificationType} (${tabType} tab). Your SMS notifications are working!`;
  }

  getContent(notificationType, data) {
    const messages = {
      returnReminders: `LeaseHub: Your rental return is due in ${data.leadTime} days. Order #${data.orderId}. Please return items by ${data.returnDate}.`,
      paymentReminders: `LeaseHub: Payment of $${data.amount} is due for order #${data.orderId}. Please complete payment to avoid late fees.`,
      overdueAlerts: `LeaseHub: URGENT - Your rental is overdue! Order #${data.orderId}. Please return items immediately or contact us.`,
      pickupReminders: `LeaseHub: Your rental pickup is scheduled for ${data.pickupDate}. Order #${data.orderId}. Please be available for delivery.`,
      orderConfirmation: `LeaseHub: Order #${data.orderId} confirmed! Total: $${data.amount}. Pickup: ${data.pickupDate}. Return: ${data.returnDate}.`
    };
    
    return messages[notificationType] || `LeaseHub: Notification for order #${data.orderId}. Please check your email for details.`;
  }

  // Helper method to format phone numbers
  formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add +1 prefix if it's a 10-digit US number
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    // Add + if it's an 11-digit number starting with 1
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    // Return as is if it already has country code
    return phoneNumber;
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(formatted);
  }
}

module.exports = new SMSService();
