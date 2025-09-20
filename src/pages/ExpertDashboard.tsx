import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { 
  Users, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Calendar,
  FileText,
  Video,
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

const ExpertDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockUser = {
    name: "Dr. Rajesh Kumar",
    email: "expert@smartcrop.com",
    role: "Agricultural Expert",
    specialization: "Crop Disease Management",
    experience: "15 years",
    rating: 4.8,
    consultations: 1250
  };

  const stats = [
    {
      title: "Active Consultations",
      value: "24",
      icon: MessageSquare,
      trend: "+12%",
      description: "This month"
    },
    {
      title: "Farmers Helped",
      value: "1,250",
      icon: Users,
      trend: "+18%",
      description: "Total consultations"
    },
    {
      title: "Success Rate",
      value: "94%",
      icon: Award,
      trend: "+2%",
      description: "Problem resolution"
    },
    {
      title: "Monthly Revenue",
      value: "₹85,000",
      icon: TrendingUp,
      trend: "+25%",
      description: "This month"
    }
  ];

  const pendingConsultations = [
    {
      id: 1,
      farmer: "Ramesh Singh",
      location: "Amritsar, Punjab",
      issue: "Wheat yellow rust disease",
      priority: "high",
      time: "2 hours ago",
      crop: "Wheat"
    },
    {
      id: 2,
      farmer: "Preet Kaur",
      location: "Ludhiana, Punjab",
      issue: "Rice blast fungus symptoms",
      priority: "medium",
      time: "4 hours ago",
      crop: "Rice"
    },
    {
      id: 3,
      farmer: "Gurjit Singh",
      location: "Bathinda, Punjab",
      issue: "Cotton bollworm infestation",
      priority: "high",
      time: "6 hours ago",
      crop: "Cotton"
    }
  ];

  const recentArticles = [
    {
      title: "Managing Wheat Diseases in Punjab Climate",
      status: "published",
      views: 2400,
      date: "2 days ago"
    },
    {
      title: "Organic Pest Control Methods for Cotton",
      status: "draft",
      views: 0,
      date: "5 days ago"
    },
    {
      title: "Rice Crop Management Best Practices",
      status: "published",
      views: 1800,
      date: "1 week ago"
    }
  ];

  const upcomingWebinars = [
    {
      title: "Advanced Crop Disease Identification",
      date: "2024-01-25",
      time: "10:00 AM",
      registered: 245
    },
    {
      title: "Sustainable Farming Practices",
      date: "2024-01-28",
      time: "2:00 PM",
      registered: 180
    }
  ];

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
        userRole="expert"
      />

      <main className="ml-0 md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Expert Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {mockUser.name}. You have {pendingConsultations.length} pending consultations.
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
          <Tabs defaultValue="consultations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="webinars">Webinars</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="consultations" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Consultations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Pending Consultations
                    </CardTitle>
                    <CardDescription>
                      Farmers waiting for your expert advice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingConsultations.map((consultation) => (
                      <div key={consultation.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{consultation.farmer}</h4>
                            <p className="text-sm text-muted-foreground">{consultation.location}</p>
                          </div>
                          <Badge className={getPriorityColor(consultation.priority)}>
                            {consultation.priority}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{consultation.issue}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{consultation.time}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4 mr-1" />
                              Video Call
                            </Button>
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Respond
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your recent consultations and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">Successfully resolved wheat disease case</p>
                          <p className="text-xs text-muted-foreground">Farmer Kuldeep Singh - 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Award className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Received 5-star rating</p>
                          <p className="text-xs text-muted-foreground">For cotton pest management advice</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="text-sm font-medium">Published new research article</p>
                          <p className="text-xs text-muted-foreground">Rice crop optimization techniques</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Knowledge Articles</CardTitle>
                      <CardDescription>Share your expertise with the farming community</CardDescription>
                    </div>
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      New Article
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentArticles.map((article, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{article.title}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                              {article.status}
                            </Badge>
                            {article.status === 'published' && (
                              <span className="text-sm text-muted-foreground">{article.views} views</span>
                            )}
                            <span className="text-sm text-muted-foreground">{article.date}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="webinars" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Upcoming Webinars</CardTitle>
                      <CardDescription>Scheduled knowledge sharing sessions</CardDescription>
                    </div>
                    <Button>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Webinar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingWebinars.map((webinar, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{webinar.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {webinar.date} at {webinar.time}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              {webinar.registered} farmers registered
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Your impact on the farming community</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Response Time (Avg)</span>
                        <span className="font-semibold">2.3 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Resolution Rate</span>
                        <span className="font-semibold">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Farmer Satisfaction</span>
                        <span className="font-semibold">4.8/5.0</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Knowledge Articles</span>
                        <span className="font-semibold">42 published</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Specialization Areas</CardTitle>
                    <CardDescription>Your areas of expertise</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Crop Diseases</span>
                        <Badge>Primary</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pest Management</span>
                        <Badge variant="secondary">Secondary</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Soil Health</span>
                        <Badge variant="secondary">Secondary</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Organic Farming</span>
                        <Badge variant="outline">Developing</Badge>
                      </div>
                    </div>
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

export default ExpertDashboard;