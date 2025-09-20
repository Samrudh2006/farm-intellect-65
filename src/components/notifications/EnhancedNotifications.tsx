import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings,
  Trash2,
  Filter,
  TrendingUp,
  Cloud,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: 'disease' | 'document' | 'market' | 'weather' | 'expert' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  metadata?: any;
}

export const EnhancedNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'disease',
      title: 'Disease Detected',
      message: 'Leaf blight detected in your tomato crop. Immediate action recommended.',
      timestamp: new Date('2024-01-20T10:30:00'),
      isRead: false,
      priority: 'high',
      metadata: { cropType: 'tomato', confidence: 95 }
    },
    {
      id: '2',
      type: 'document',
      title: 'Document Verified',
      message: 'Your land ownership document has been successfully verified.',
      timestamp: new Date('2024-01-20T09:15:00'),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'market',
      title: 'Price Alert',
      message: 'Wheat prices increased by 8% in your region. Consider selling.',
      timestamp: new Date('2024-01-19T16:45:00'),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'weather',
      title: 'Weather Alert',
      message: 'Heavy rainfall expected in next 48 hours. Protect your crops.',
      timestamp: new Date('2024-01-19T14:20:00'),
      isRead: false,
      priority: 'high'
    },
    {
      id: '5',
      type: 'expert',
      title: 'Expert Response',
      message: 'Dr. Kumar has responded to your crop health query.',
      timestamp: new Date('2024-01-19T11:30:00'),
      isRead: true,
      priority: 'low'
    }
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    diseaseAlerts: true,
    marketUpdates: true,
    weatherAlerts: true,
    expertResponses: true
  });

  const [filter, setFilter] = useState<'all' | 'unread' | 'disease' | 'document' | 'market' | 'weather'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'disease':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'document':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'market':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'weather':
        return <Cloud className="h-5 w-5 text-gray-500" />;
      case 'expert':
        return <User className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: false } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed."
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read."
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
        <Button onClick={markAllAsRead} variant="outline">
          Mark All as Read
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'disease' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('disease')}
            >
              Disease Alerts
            </Button>
            <Button
              variant={filter === 'document' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('document')}
            >
              Documents
            </Button>
            <Button
              variant={filter === 'market' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('market')}
            >
              Market Updates
            </Button>
            <Button
              variant={filter === 'weather' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('weather')}
            >
              Weather Alerts
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications found</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all ${!notification.isRead ? 'border-l-4 border-l-primary bg-muted/20' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && (
                              <div className="h-2 w-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.metadata && (
                              <span>
                                {notification.type === 'disease' && `Confidence: ${notification.metadata.confidence}%`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                        >
                          {notification.isRead ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch
                      id="sms-notifications"
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="disease-alerts">Disease Detection Alerts</Label>
                    <Switch
                      id="disease-alerts"
                      checked={settings.diseaseAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, diseaseAlerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="market-updates">Market Price Updates</Label>
                    <Switch
                      id="market-updates"
                      checked={settings.marketUpdates}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, marketUpdates: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weather-alerts">Weather Alerts</Label>
                    <Switch
                      id="weather-alerts"
                      checked={settings.weatherAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weatherAlerts: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="expert-responses">Expert Responses</Label>
                    <Switch
                      id="expert-responses"
                      checked={settings.expertResponses}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, expertResponses: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => {
                localStorage.setItem('notificationSettings', JSON.stringify(settings));
                toast({
                  title: "Settings Saved",
                  description: "Your notification preferences have been updated."
                });
              }}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};