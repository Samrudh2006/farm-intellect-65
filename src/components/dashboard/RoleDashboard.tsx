import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  TrendingUp, 
  Wallet, 
  Users, 
  Wheat,
  ShoppingCart,
  CheckCircle,
  Clock,
  Package,
  Truck,
  BookOpen,
  Star,
  MessageSquare,
  Eye,
  Edit3,
  Settings,
  AlertTriangle,
  Activity,
  Building,
  Award,
  BarChart3,
  Plus,
  Brain,
  Target,
  Zap
} from "lucide-react";

interface RoleDashboardProps {
  userRole: string;
}

export const RoleDashboard = ({ userRole }: RoleDashboardProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const navigate = useNavigate();

  const getDashboardContent = () => {
    switch (userRole) {
      case "merchant":
        return {
          title: "Merchant Dashboard",
          overview: [
            { icon: Users, label: "Partner Farmers", value: "156", trend: "+23%" },
            { icon: Package, label: "Available Crops", value: "2.8K tons", trend: "+15%" },
            { icon: TrendingUp, label: "Monthly Revenue", value: "₹2.4L", trend: "+8%" },
            { icon: CheckCircle, label: "Verified Documents", value: "142", trend: "+18%" }
          ],
          recentActivity: [
            { action: "New farmer partnership: Rajesh Sharma", time: "2 hours ago", type: "partnership" },
            { action: "Document verification completed for 5 farmers", time: "4 hours ago", type: "verification" },
            { action: "Market price analysis updated", time: "1 day ago", type: "market" },
            { action: "Crop quality assessment completed", time: "2 days ago", type: "quality" }
          ],
          quickActions: [
            { icon: Users, label: "🤝 View Partner Farmers", color: "primary", description: "Connect with your trusted farmer network", route: "/merchant/farmers" },
            { icon: TrendingUp, label: "📈 Market Price Analysis", color: "secondary", description: "Stay ahead with market insights", route: "/merchant/market-prices" },
            { icon: Eye, label: "✅ Document Verification", color: "outline", description: "Review and approve farmer documents", route: "/merchant/documents" },
            { icon: MessageSquare, label: "💬 Contact Farmers", color: "outline", description: "Build stronger partnerships", route: "/merchant/farmers" }
          ]
        };

      case "expert":
        return {
          title: "AI Expert Dashboard",
          overview: [
            { icon: Activity, label: "AI Scans Completed", value: "1,247", trend: "+32%" },
            { icon: AlertTriangle, label: "Diseases Detected", value: "89", trend: "+18%" },
            { icon: Target, label: "AI Accuracy Rate", value: "94.2%", trend: "+1.2%" },
            { icon: Zap, label: "Prevention Tips", value: "156", trend: "+25%" }
          ],
          recentActivity: [
            { action: "AI scan: Late blight detected in wheat crop", time: "1 hour ago", type: "ai-scan" },
            { action: "Medicine recommendation sent to farmer", time: "2 hours ago", type: "medicine" },
            { action: "Prevention tip published for cotton pest", time: "4 hours ago", type: "prevention" },
            { action: "AI model accuracy improved to 94.2%", time: "1 day ago", type: "ai-improvement" }
          ],
          quickActions: [
            { icon: Activity, label: "🔬 AI Crop Scanner", color: "primary", description: "Diagnose crop diseases instantly", route: "/expert/ai-crop-scanner" },
            { icon: Brain, label: "🧠 AI Advisory Engine", color: "secondary", description: "Provide expert recommendations", route: "/expert/ai-advisory" },
            { icon: MessageSquare, label: "🤖 AI Assistant Chat", color: "outline", description: "Answer farmer questions 24/7", route: "/expert/chat" },
            { icon: BarChart3, label: "📊 AI Analytics", color: "outline", description: "Track AI performance metrics", route: "/expert/dashboard" }
          ]
        };

      case "admin":
        return {
          title: "Admin Dashboard", 
          overview: [
            { icon: Users, label: "Total Users", value: "1,247", trend: "+15%" },
            { icon: Building, label: "Active Organizations", value: "89", trend: "+7%" },
            { icon: Activity, label: "System Health", value: "99.2%", trend: "+0.3%" },
            { icon: AlertTriangle, label: "Open Issues", value: "3", trend: "-50%" }
          ],
          recentActivity: [
            { action: "New merchant verification completed", time: "30 minutes ago", type: "verification" },
            { action: "System backup completed successfully", time: "2 hours ago", type: "system" },
            { action: "Expert training session conducted", time: "5 hours ago", type: "training" },
            { action: "Security audit report generated", time: "1 day ago", type: "security" }
          ],
          quickActions: [
            { icon: Users, label: "👥 Manage Users", color: "primary", description: "Oversee platform community", route: "/admin/users" },
            { icon: Settings, label: "⚙️ System Configuration", color: "secondary", description: "Fine-tune platform settings", route: "/admin/settings" },
            { icon: Award, label: "✅ Approve Verifications", color: "outline", description: "Review pending approvals", route: "/admin/users" },
            { icon: BarChart3, label: "📊 Generate Reports", color: "outline", description: "Create comprehensive analytics", route: "/admin/analytics" }
          ]
        };

      default: // farmer
        return {
          title: "Farmer Dashboard",
          overview: [
            { icon: Wheat, label: "Active Crops", value: "5", trend: "+1" },
            { icon: Calendar, label: "Upcoming Tasks", value: "8", trend: "+3" },
            { icon: TrendingUp, label: "Expected Yield", value: "42 tons", trend: "+12%" },
            { icon: Wallet, label: "Est. Revenue", value: "₹3.2L", trend: "+8%" }
          ],
          recentActivity: [
            { action: "Irrigation scheduled for wheat field", time: "2 hours ago", type: "irrigation" },
            { action: "Weather alert: Rain expected tomorrow", time: "4 hours ago", type: "weather" },
            { action: "Fertilizer application completed", time: "1 day ago", type: "fertilizer" },
            { action: "Soil test results received", time: "3 days ago", type: "soil" }
          ],
          quickActions: [
            { icon: Plus, label: "🌱 Plant New Crop", color: "primary", description: "Start your next growing season", route: "/farmer/crops" },
            { icon: Calendar, label: "📅 Schedule Farm Activity", color: "secondary", description: "Plan your farming tasks", route: "/farmer/calendar" },
            { icon: MessageSquare, label: "🎓 Ask an Expert", color: "outline", description: "Get professional guidance", route: "/farmer/chat" },
            { icon: TrendingUp, label: "💰 Check Market Prices", color: "outline", description: "Maximize your profits", route: "/farmer/merchants" }
          ]
        };
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order": return ShoppingCart;
      case "price": return TrendingUp;
      case "payment": return Wallet;
      case "quality": return CheckCircle;
      case "consultation": return MessageSquare;
      case "article": return BookOpen;
      case "session": return Users;
      case "report": return BarChart3;
      case "verification": return Award;
      case "system": return Settings;
      case "training": return BookOpen;
      case "security": return AlertTriangle;
      case "irrigation": return Clock;
      case "weather": return Calendar;
      case "fertilizer": return Wheat;
      case "soil": return Activity;
      case "partnership": return Users;
      case "market": return TrendingUp;
      case "ai-scan": return Brain;
      case "medicine": return Plus;
      case "prevention": return Zap;
      case "ai-improvement": return Target;
      default: return User;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order": case "payment": return "text-green-600";
      case "price": case "consultation": return "text-blue-600";
      case "quality": case "verification": return "text-purple-600";
      case "system": case "security": return "text-orange-600";
      case "irrigation": case "fertilizer": return "text-green-600";
      case "weather": return "text-blue-600";
      case "soil": return "text-brown-600";
      case "partnership": return "text-green-600";
      case "market": return "text-blue-600";
      case "ai-scan": return "text-purple-600";
      case "medicine": return "text-green-600";
      case "prevention": return "text-blue-600";
      case "ai-improvement": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const dashboardData = getDashboardContent();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{dashboardData.title}</h1>
        <Badge variant="outline" className="text-sm">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.overview.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <div className="p-2 rounded-full bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className={item.trend.startsWith('+') ? 'text-green-600 font-medium' : item.trend.startsWith('-') ? 'text-red-600 font-medium' : 'text-gray-600'}>
                  {item.trend}
                </span>
                {" from last month"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.recentActivity.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getTypeColor(activity.type)} bg-muted`}>
                    <ActivityIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardData.quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.color as any}
                className="w-full justify-start h-auto p-4 hover:scale-105 transition-transform duration-200"
                size="lg"
                onClick={() => navigate((action as any).route)}
              >
                <div className="flex items-center gap-3 w-full">
                  <action.icon className="h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{action.label}</span>
                    {(action as any).description && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {(action as any).description}
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};