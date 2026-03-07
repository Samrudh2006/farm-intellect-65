import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Shield,
  Trash2,
  Settings,
  BellRing,
  Clock,
  X
} from "lucide-react";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'reminder';
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, unknown>;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");

  const mockNotifications: Notification[] = [
    {
      id: "1",
      title: "Document Verified",
      message: "Your land records document has been successfully verified by our experts.",
      type: "success",
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2", 
      title: "Crop Calendar Reminder",
      message: "Time for first irrigation of your wheat crop in Field A.",
      type: "reminder",
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: "3",
      title: "Weather Alert",
      message: "Heavy rainfall expected in your area in the next 48 hours. Secure your crops.",
      type: "warning",
      isRead: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
    {
      id: "4",
      title: "New Market Price Update", 
      message: "Wheat prices have increased by 5% in your local market.",
      type: "info",
      isRead: false,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    {
      id: "5",
      title: "Expert Response",
      message: "Dr. Sharma has responded to your question about pest control in cotton crops.",
      type: "info",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "6",
      title: "System Maintenance",
      message: "The system will be under maintenance on Sunday from 2 AM to 4 AM.",
      type: "warning",
      isRead: false,
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    }
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: <Info className="h-5 w-5 text-blue-600" />,
      warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      error: <AlertTriangle className="h-5 w-5 text-red-600" />,
      success: <CheckCircle className="h-5 w-5 text-green-600" />,
      reminder: <Calendar className="h-5 w-5 text-purple-600" />
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  const getNotificationBadge = (type: string) => {
    const badges = {
      info: <Badge variant="secondary">Info</Badge>,
      warning: <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>,
      error: <Badge variant="destructive">Error</Badge>,
      success: <Badge className="bg-green-100 text-green-800">Success</Badge>,
      reminder: <Badge className="bg-purple-100 text-purple-800">Reminder</Badge>
    };
    return badges[type as keyof typeof badges] || badges.info;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const markAsRead = (_id: string) => {
    // In real app, this would make an API call
  };

  const deleteNotification = (_id: string) => {
    // In real app, this would make an API call
  };

  const markAllAsRead = () => {
    // In real app, this would make an API call
  };

  const filterNotifications = (notifications: Notification[], filter: string) => {
    switch (filter) {
      case "unread":
        return notifications.filter(n => !n.isRead);
      case "read":
        return notifications.filter(n => n.isRead);
      case "reminders":
        return notifications.filter(n => n.type === "reminder");
      case "alerts":
        return notifications.filter(n => n.type === "warning" || n.type === "error");
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications(mockNotifications, selectedTab);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              Stay updated with important information and reminders
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BellRing className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{mockNotifications.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockNotifications.filter(n => n.type === "reminder").length}
                </p>
                <p className="text-sm text-muted-foreground">Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {mockNotifications.filter(n => n.type === "warning" || n.type === "error").length}
                </p>
                <p className="text-sm text-muted-foreground">Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Manage your notifications and stay informed about important updates
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{notification.title}</h4>
                              {getNotificationBadge(notification.type)}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                          <span>•</span>
                          <span>{format(notification.createdAt, "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {selectedTab === "all" 
                      ? "You're all caught up! No notifications to display."
                      : `No ${selectedTab} notifications found.`
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how and when you want to receive notifications
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive critical alerts via SMS
                </p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Push Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Receive real-time notifications in your browser
                </p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};