// For production, install: npm install @sendgrid/mail
// const sgMail = require('@sendgrid/mail');

// Mock SendGrid for development (replace with actual SendGrid in production)
class MockSendGrid {
  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || 'mock-api-key';
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@leasehub.com';
  }

  async send(mailData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Log the email for development
    console.log('📧 EMAIL SENT:', {
      to: mailData.to,
      from: mailData.from,
      subject: mailData.subject,
      text: mailData.text?.substring(0, 100) + '...',
      html: mailData.html ? 'HTML content present' : 'No HTML'
    });

    // In production, this would be:
    // return sgMail.send(mailData);
    
    return { success: true, messageId: `mock-${Date.now()}` };
  }
}

// Initialize SendGrid
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendGrid = new MockSendGrid();

class EmailService {
  constructor() {
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@leasehub.com';
    this.fromName = process.env.SENDGRID_FROM_NAME || 'LeaseHub Suite';
  }

  async sendTestEmail(to, notificationType, tabType) {
    try {
      const subject = this.getTestSubject(notificationType, tabType);
      const content = this.getTestContent(notificationType, tabType);
      
      const mailData = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        text: content.text,
        html: content.html
      };

      const result = await sendGrid.send(mailData);
      
      // Log the notification
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationSent(
        notificationType,
        'email',
        to,
        content.text
      );

      return result;
    } catch (error) {
      console.error('Error sending test email:', error);
      
      // Log the error
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationError(
        notificationType,
        'email',
        to,
        error
      );
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendNotificationEmail(to, notificationType, data) {
    try {
      const subject = this.getSubject(notificationType, data);
      const content = this.getContent(notificationType, data);
      
      const mailData = {
        to,
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject,
        text: content.text,
        html: content.html
      };

      const result = await sendGrid.send(mailData);
      
      // Log the notification
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationSent(
        notificationType,
        'email',
        to,
        content.text
      );

      return result;
    } catch (error) {
      console.error('Error sending notification email:', error);
      
      // Log the error
      const notificationSettingsService = require('./notificationSettingsService');
      await notificationSettingsService.logNotificationError(
        notificationType,
        'email',
        to,
        error
      );
      
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  getTestSubject(notificationType, tabType) {
    const subjects = {
      returnReminders: '[TEST] Return Reminder - LeaseHub Suite',
      paymentReminders: '[TEST] Payment Reminder - LeaseHub Suite',
      overdueAlerts: '[TEST] Overdue Alert - LeaseHub Suite',
      pickupReminders: '[TEST] Pickup Reminder - LeaseHub Suite',
      orderConfirmation: '[TEST] Order Confirmation - LeaseHub Suite'
    };
    
    return subjects[notificationType] || '[TEST] Notification - LeaseHub Suite';
  }

  getTestContent(notificationType, tabType) {
    const baseText = `This is a test notification for ${notificationType} (${tabType} tab).

This email was sent to verify your notification settings are working correctly.

Notification Type: ${notificationType}
Tab Type: ${tabType}
Sent At: ${new Date().toLocaleString()}

If you received this email, your email notification settings are working properly.

Best regards,
The LeaseHub Suite Team`;

    const baseHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Notification</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        .test-badge { background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>LeaseHub Suite</h1>
            <span class="test-badge">TEST NOTIFICATION</span>
        </div>
        <div class="content">
            <h2>Test Notification</h2>
            <p>This is a test notification for <strong>${notificationType}</strong> (${tabType} tab).</p>
            <p>This email was sent to verify your notification settings are working correctly.</p>
            
            <div style="background: #e5e7eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <strong>Notification Details:</strong><br>
                Type: ${notificationType}<br>
                Tab: ${tabType}<br>
                Sent: ${new Date().toLocaleString()}
            </div>
            
            <p>If you received this email, your email notification settings are working properly.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The LeaseHub Suite Team</p>
        </div>
    </div>
</body>
</html>`;

    return { text: baseText, html: baseHtml };
  }

  getSubject(notificationType, data) {
    const subjects = {
      returnReminders: `Return Reminder - Order #${data.orderId}`,
      paymentReminders: `Payment Due - Order #${data.orderId}`,
      overdueAlerts: `URGENT: Overdue Rental - Order #${data.orderId}`,
      pickupReminders: `Pickup Reminder - Order #${data.orderId}`,
      orderConfirmation: `Order Confirmation - Order #${data.orderId}`
    };
    
    return subjects[notificationType] || 'LeaseHub Suite Notification';
  }

  getContent(notificationType, data) {
    // This would contain actual notification content based on the type and data
    const text = `Notification content for ${notificationType} with data: ${JSON.stringify(data)}`;
    const html = `<p>Notification content for ${notificationType}</p>`;
    
    return { text, html };
  }
}

module.exports = new EmailService();
