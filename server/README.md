# LeaseHub Suite - Notification Management System

A comprehensive notification management system for the LeaseHub Suite rental platform, supporting email, SMS, and internal notifications.

## Features

- **Multi-channel Notifications**: Email (SendGrid), SMS (Twilio), and Internal (WebSocket)
- **Configurable Settings**: Per-notification type settings with lead times and channel selection
- **Test Notifications**: Send test notifications to verify configuration
- **Notification History**: Track and view notification history
- **Real-time Updates**: WebSocket-based internal notifications
- **Error Handling**: Comprehensive error logging and retry mechanisms

## Project Structure

```
server/
├── server.js                    # Main Express server
├── routes/
│   └── notifications.js         # Notification API routes
├── services/
│   ├── emailService.js          # SendGrid email service
│   ├── smsService.js            # Twilio SMS service
│   ├── internalService.js       # WebSocket internal notifications
│   └── notificationSettingsService.js # Settings and history management
├── data/                        # JSON file storage (development)
├── package.json                 # Server dependencies
└── env.example                  # Environment variables template
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the environment template and configure your API keys:

```bash
cp env.example .env
```

Edit `.env` with your actual API credentials:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_actual_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=LeaseHub Suite

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_actual_twilio_account_sid
TWILIO_AUTH_TOKEN=your_actual_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 3. API Service Setup

#### SendGrid Setup
1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Navigate to Settings → API Keys
3. Create a new API key with "Mail Send" permissions
4. Add your domain to SendGrid for sending emails
5. Update your `.env` file with the API key

#### Twilio Setup
1. Create a Twilio account at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token from the Console
3. Purchase a phone number for sending SMS
4. Update your `.env` file with the credentials

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on port 3001 (or the port specified in your `.env` file).

## API Endpoints

### Notification Settings

#### GET `/api/notifications/settings`
Retrieve current notification settings.

**Response:**
```json
{
  "settings": {
    "returnReminders": {
      "enabled": true,
      "leadTime": 3,
      "channels": ["email", "sms"],
      "customerEnabled": true,
      "internalEnabled": true
    },
    // ... other notification types
  }
}
```

#### POST `/api/notifications/settings`
Save notification settings.

**Request Body:**
```json
{
  "settings": {
    "returnReminders": {
      "enabled": true,
      "leadTime": 3,
      "channels": ["email", "sms"],
      "customerEnabled": true,
      "internalEnabled": true
    }
  }
}
```

### Test Notifications

#### POST `/api/notifications/test`
Send test notifications based on current settings.

**Request Body:**
```json
{
  "type": "customer",
  "settings": { /* current settings */ },
  "testEmail": "test@example.com",
  "testPhone": "+1234567890"
}
```

**Response:**
```json
{
  "message": "Test notifications sent successfully",
  "sentChannels": ["Email", "SMS", "Internal"],
  "errors": []
}
```

### Notification History

#### GET `/api/notifications/history`
Retrieve notification history with optional filters.

**Query Parameters:**
- `type`: Filter by notification type
- `channel`: Filter by channel (email, sms, internal)
- `days`: Number of days to look back (default: 7)

## Frontend Integration

The React frontend communicates with these API endpoints to:

1. **Load Settings**: Fetch current notification settings on page load
2. **Save Settings**: Save changes when "Save Changes" is clicked
3. **Test Notifications**: Send test notifications when "Test Notifications" is clicked
4. **View History**: Display notification history in the history tab

### Example Frontend API Calls

```javascript
// Load settings
const response = await fetch('/api/notifications/settings');
const { settings } = await response.json();

// Save settings
const response = await fetch('/api/notifications/settings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ settings })
});

// Send test notifications
const response = await fetch('/api/notifications/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'customer',
    settings: currentSettings,
    testEmail: 'test@example.com',
    testPhone: '+1234567890'
  })
});
```

## Development vs Production

### Development Mode
- Uses mock services that log to console
- Stores data in JSON files
- No actual emails/SMS sent
- Perfect for testing and development

### Production Mode
1. Replace mock services with real implementations
2. Use a proper database (PostgreSQL, MongoDB)
3. Configure real SendGrid and Twilio credentials
4. Set up WebSocket server for real-time notifications
5. Add authentication and rate limiting

### Production Deployment

1. **Database Setup**:
   ```bash
   # PostgreSQL
   DATABASE_URL=postgresql://username:password@localhost:5432/leasehub_db
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/leasehub_db
   ```

2. **WebSocket Setup**:
   ```javascript
   // In server.js
   const io = require('socket.io')(server);
   require('./services/internalService').initializeWebSocket(io);
   ```

3. **Security**:
   - Add JWT authentication
   - Implement rate limiting
   - Use HTTPS
   - Add input validation

## Troubleshooting

### Common Issues

1. **Email Not Sending**:
   - Verify SendGrid API key is correct
   - Check sender email is verified in SendGrid
   - Ensure domain is authenticated

2. **SMS Not Sending**:
   - Verify Twilio credentials
   - Check phone number format (+1234567890)
   - Ensure Twilio account has credits

3. **Internal Notifications Not Working**:
   - Check WebSocket connection
   - Verify client is connected to server
   - Check browser console for errors

### Logs

The server logs all notification activities to the console:

```
📧 EMAIL SENT: { to: 'test@example.com', subject: '...' }
📱 SMS SENT: { to: '+1234567890', body: '...' }
🔔 INTERNAL NOTIFICATION SENT: { type: 'warning', title: '...' }
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
