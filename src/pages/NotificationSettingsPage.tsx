import React, { useState, useEffect } from 'react';
import { Bell, Mail, MessageSquare, Calendar, Settings, Users, Clock, CheckCircle2, AlertCircle, Save, TestTube as Test } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  onNavigate?: (page: string) => void;
}

interface NotificationSettings {
  returnReminders: {
    enabled: boolean;
    leadTime: number;
    channels: string[];
    customerEnabled: boolean;
    internalEnabled: boolean;
  };
  paymentReminders: {
    enabled: boolean;
    leadTime: number;
    channels: string[];
    customerEnabled: boolean;
    internalEnabled: boolean;
  };
  overdueAlerts: {
    enabled: boolean;
    leadTime: number;
    channels: string[];
    customerEnabled: boolean;
    internalEnabled: boolean;
  };
  pickupReminders: {
    enabled: boolean;
    leadTime: number;
    channels: string[];
    customerEnabled: boolean;
    internalEnabled: boolean;
  };
  orderConfirmation: {
    enabled: boolean;
    channels: string[];
    customerEnabled: boolean;
    internalEnabled: boolean;
  };
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
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
  });

  const [activeTab, setActiveTab] = useState('customer');

  const notificationTypes = [
    {
      key: 'returnReminders',
      title: 'Return Reminders',
      description: 'Notify customers and staff before rental return dates',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      key: 'paymentReminders',
      title: 'Payment Reminders',
      description: 'Send reminders for pending payments and deposits',
      icon: AlertCircle,
      color: 'text-orange-600'
    },
    {
      key: 'overdueAlerts',
      title: 'Overdue Alerts',
      description: 'Urgent notifications for overdue rentals and payments',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      key: 'pickupReminders',
      title: 'Pickup Reminders',
      description: 'Notifications for scheduled item pickups',
      icon: Clock,
      color: 'text-green-600'
    },
    {
      key: 'orderConfirmation',
      title: 'Order Confirmations',
      description: 'Automatic confirmations for new rental orders',
      icon: CheckCircle2,
      color: 'text-purple-600'
    }
  ];

  const channels = [
    { id: 'email', name: 'Email', icon: Mail, description: 'Send via email' },
    { id: 'sms', name: 'SMS', icon: MessageSquare, description: 'Send via text message' },
    { id: 'internal', name: 'Internal', icon: Bell, description: 'Internal dashboard notifications' }
  ];

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (type: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleChannelToggle = (type: string, channelId: string) => {
    const currentChannels = settings[type as keyof typeof settings].channels;
    const updatedChannels = currentChannels.includes(channelId)
      ? currentChannels.filter((c: string) => c !== channelId)
      : [...currentChannels, channelId];
    
    handleSettingChange(type, 'channels', updatedChannels);
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/notifications/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification settings saved successfully",
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Get current settings for the active tab
      const currentSettings = settings;
      const testData = {
        type: activeTab,
        settings: currentSettings,
        testEmail: 'test@example.com',
        testPhone: '+1234567890'
      };

      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Test Notifications Sent",
          description: `Successfully sent test notifications via ${result.sentChannels.join(', ')}`,
        });
      } else {
        throw new Error('Failed to send test notifications');
      }
    } catch (error) {
      console.error('Error sending test notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send test notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recentNotifications = [
    {
      id: 1,
      type: 'Return Reminder',
      recipient: 'john@example.com',
      channel: 'Email',
      status: 'delivered',
      timestamp: '2024-01-15 14:30',
      content: 'Reminder: Your rental return is due tomorrow'
    },
    {
      id: 2,
      type: 'Payment Due',
      recipient: '+1-555-0124',
      channel: 'SMS',
      status: 'delivered',
      timestamp: '2024-01-15 12:15',
      content: 'Payment of $690 is due for order #RNT-2024-002'
    },
    {
      id: 3,
      type: 'Overdue Alert',
      recipient: 'Internal Staff',
      channel: 'Internal',
      status: 'read',
      timestamp: '2024-01-15 09:45',
      content: 'Order #RNT-2024-004 is now overdue'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notification settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-1">Configure automated notifications and reminders for customers and staff</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleTestNotifications}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Test size={16} />
            <span>{isLoading ? 'Sending...' : 'Test Notifications'}</span>
          </button>
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-100">
        <nav className="flex space-x-1">
          {[
            { id: 'customer', name: 'Customer Notifications', icon: Users },
            { id: 'internal', name: 'Internal Notifications', icon: Settings },
            { id: 'history', name: 'Notification History', icon: Clock }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'customer' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Notification Settings</h2>
            
            <div className="space-y-8">
              {notificationTypes.map((notificationType) => (
                <div key={notificationType.key} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-50 ${notificationType.color}`}>
                      <notificationType.icon size={24} />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{notificationType.title}</h3>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={settings[notificationType.key as keyof typeof settings].enabled}
                              onChange={(e) => handleSettingChange(notificationType.key, 'enabled', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">Enabled</span>
                          </label>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{notificationType.description}</p>
                      </div>

                      {settings[notificationType.key as keyof typeof settings].enabled && (
                        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                          {/* Lead Time Settings */}
                          {['returnReminders', 'paymentReminders', 'overdueAlerts', 'pickupReminders'].includes(notificationType.key) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Lead Time (days)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  max="30"
                                  value={settings[notificationType.key as keyof typeof settings].leadTime}
                                  onChange={(e) => handleSettingChange(notificationType.key, 'leadTime', parseInt(e.target.value))}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Send to Customer
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={settings[notificationType.key as keyof typeof settings].customerEnabled}
                                    onChange={(e) => handleSettingChange(notificationType.key, 'customerEnabled', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Enable customer notifications</span>
                                </label>
                              </div>
                            </div>
                          )}

                          {/* Notification Channels */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Notification Channels
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {channels.map((channel) => (
                                <div
                                  key={channel.id}
                                  onClick={() => handleChannelToggle(notificationType.key, channel.id)}
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                    settings[notificationType.key as keyof typeof settings].channels.includes(channel.id)
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <channel.icon size={20} className={
                                      settings[notificationType.key as keyof typeof settings].channels.includes(channel.id)
                                        ? 'text-blue-600'
                                        : 'text-gray-400'
                                    } />
                                    <div>
                                      <div className="font-medium text-sm">{channel.name}</div>
                                      <div className="text-xs text-gray-600">{channel.description}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'internal' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Internal Staff Notifications</h2>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle size={20} className="text-yellow-600" />
                <span className="font-medium text-yellow-800">Internal notifications help staff stay informed about critical rental events</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Dashboard Alerts</h3>
                <div className="space-y-3">
                  {['Overdue Rentals', 'Payment Failures', 'Inventory Issues', 'Customer Complaints'].map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{alert}</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-3">
                  {['New Orders', 'Return Confirmations', 'Payment Updates', 'System Errors'].map((notification, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{notification}</span>
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Staff Email Recipients</h3>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="manager@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="email"
                  placeholder="operations@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">+ Add another email</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
            <div className="flex space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Types</option>
                <option>Email</option>
                <option>SMS</option>
                <option>Internal</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Type</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Recipient</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Channel</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Sent</th>
                  <th className="text-left py-3 text-sm font-medium text-gray-600">Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="py-4 text-sm font-medium text-gray-900">{notification.type}</td>
                    <td className="py-4 text-sm text-gray-600">{notification.recipient}</td>
                    <td className="py-4 text-sm text-gray-600">{notification.channel}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        notification.status === 'read' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {notification.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{notification.timestamp}</td>
                    <td className="py-4 text-sm text-gray-600 max-w-xs truncate">{notification.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;
