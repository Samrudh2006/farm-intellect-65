import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Store,
  GraduationCap,
  Database,
  Server,
  Zap
} from "lucide-react";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockUser = {
    name: "Admin User",
    email: "admin@smartcrop.com",
    role: "System Administrator",
    lastLogin: "2024-01-20 09:30 AM"
  };

  const stats = [
    {
      title: "Total Users",
      value: "12,450",
      icon: Users,
      trend: "+15%",
      description: "Active users"
    },
    {
      title: "System Uptime",
      value: "99.9%",
      icon: Activity,
      trend: "+0.1%",
      description: "Last 30 days"
    },
    {
      title: "Revenue",
      value: "₹2.4M",
      icon: DollarSign,
      trend: "+22%",
      description: "This quarter"
    },
    {
      title: "API Calls",
      value: "1.2M",
      icon: TrendingUp,
      trend: "+35%",
      description: "This month"
    }
  ];

  const userStats = [
    { role: "Farmers", count: 8540, percentage: 68.6, icon: UserCheck, color: "bg-green-500" },
    { role: "Merchants", count: 2180, percentage: 17.5, icon: Store, color: "bg-blue-500" },
    { role: "Experts", count: 1580, percentage: 12.7, icon: GraduationCap, color: "bg-purple-500" },
    { role: "Admins", count: 150, percentage: 1.2, icon: Shield, color: "bg-red-500" }
  ];

  const systemHealth = [
    { service: "Authentication Service", status: "healthy", uptime: "99.9%", responseTime: "45ms" },
    { service: "Database Server", status: "healthy", uptime: "99.8%", responseTime: "12ms" },
    { service: "AI Advisory API", status: "warning", uptime: "98.2%", responseTime: "890ms" },
    { service: "Weather Data API", status: "healthy", uptime: "99.5%", responseTime: "156ms" },
    { service: "Image Processing", status: "healthy", uptime: "99.1%", responseTime: "234ms" }
  ];

  const recentActivities = [
    {
      type: "user_registration",
      message: "125 new farmers registered",
      time: "2 hours ago",
      severity: "info"
    },
    {
      type: "system_alert",
      message: "AI API response time increased",
      time: "4 hours ago",
      severity: "warning"
    },
    {
      type: "security",
      message: "Successful security scan completed",
      time: "6 hours ago",
      severity: "success"
    },
    {
      type: "maintenance",
      message: "Database backup completed",
      time: "8 hours ago",
      severity: "info"
    }
  ];

  const pendingActions = [
    {
      title: "Expert Verification",
      count: 12,
      description: "New expert applications waiting for approval",
      priority: "high"
    },
    {
      title: "Content Moderation",
      count: 8,
      description: "User-generated content flagged for review",
      priority: "medium"
    },
    {
      title: "System Updates",
      count: 3,
      description: "Security patches ready for deployment",
      priority: "high"
    },
    {
      title: "User Reports",
      count: 5,
      description: "User complaints and feedback to address",
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={mockUser}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole="admin"
      />

      <main className="ml-0 md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System overview and administrative controls for Smart Crop Advisory Platform
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={{
                  value: stat.trend + " " + stat.description,
                  trend: stat.trend.includes('+') ? 'up' : stat.trend.includes('-') ? 'down' : 'neutral'
                }}
              />
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* User Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Distribution
                    </CardTitle>
                    <CardDescription>
                      Active users by role category
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userStats.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                            <span className="text-sm font-medium">{stat.role}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{stat.count.toLocaleString()}</span>
                        </div>
                        <Progress value={stat.percentage} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Pending Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Pending Actions
                    </CardTitle>
                    <CardDescription>
                      Items requiring administrative attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingActions.map((action, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <Badge className={getPriorityColor(action.priority)}>
                            {action.priority}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">{action.count}</span>
                          <Button size="sm">Review</Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent System Activities
                  </CardTitle>
                  <CardDescription>
                    Latest system events and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${getSeverityColor(activity.severity)}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage platform users and their roles</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-20 flex flex-col items-center justify-center">
                        <UserCheck className="h-6 w-6 mb-2" />
                        Manage Farmers
                      </Button>
                      <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                        <Store className="h-6 w-6 mb-2" />
                        Manage Merchants
                      </Button>
                      <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                        <GraduationCap className="h-6 w-6 mb-2" />
                        Manage Experts
                      </Button>
                      <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                        <Shield className="h-6 w-6 mb-2" />
                        Manage Admins
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Analytics</CardTitle>
                    <CardDescription>User engagement and activity metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Daily Active Users</span>
                        <span className="font-semibold">8,456</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Weekly Active Users</span>
                        <span className="font-semibold">11,234</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">User Retention Rate</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Session Duration</span>
                        <span className="font-semibold">24 min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Health Monitor
                  </CardTitle>
                  <CardDescription>
                    Real-time status of all system services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemHealth.map((service, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                          <span className="font-medium">{service.service}</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>Uptime: {service.uptime}</span>
                          <span>Response: {service.responseTime}</span>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security Overview
                    </CardTitle>
                    <CardDescription>System security status and alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Security Score</span>
                        <span className="font-semibold text-green-600">98/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Failed Login Attempts</span>
                        <span className="font-semibold">12 (24h)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Security Scan</span>
                        <span className="font-semibold">2 hours ago</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">SSL Certificate</span>
                        <span className="font-semibold text-green-600">Valid</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Actions</CardTitle>
                    <CardDescription>Manage security settings and policies</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Run Security Scan
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      View Access Logs
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Security Policies
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Incident Reports
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                    <CardDescription>Global system settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      General Settings
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Database Configuration
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      API Configuration
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      Performance Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance</CardTitle>
                    <CardDescription>System maintenance and backup operations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Database Backup
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      System Cleanup
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Update System
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Health Check
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;