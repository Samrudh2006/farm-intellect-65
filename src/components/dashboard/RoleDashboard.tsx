import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Calendar, TrendingUp, Wallet, Users, Wheat,
  ShoppingCart, CheckCircle, Clock, Package, Truck, BookOpen,
  Star, MessageSquare, Eye, Edit3, Settings, AlertTriangle,
  Activity, Building, Award, BarChart3, Plus, Brain, Target, Zap
} from "lucide-react";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useLanguage } from "@/contexts/LanguageContext";

interface RoleDashboardProps {
  userRole: string;
}

export const RoleDashboard = ({ userRole }: RoleDashboardProps) => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cropPlans, fieldEvents, tasks, schemeMatches, activities, loading } = useDashboardData();

  const getOverviewCards = () => {
    switch (userRole) {
      case "merchant":
        return [
          { icon: Users, label: "Partner Farmers", value: activities.length > 0 ? `${activities.length}` : "0", color: "primary" },
          { icon: Package, label: "Available Crops", value: cropPlans.filter(c => c.status === 'active').length.toString() || "0", color: "accent" },
          { icon: TrendingUp, label: "Active Deals", value: `${activities.filter(a => a.action_type === 'deal').length}`, color: "navy" },
          { icon: CheckCircle, label: "Tasks Pending", value: `${tasks.length}`, color: "primary" }
        ];
      case "expert":
        return [
          { icon: Activity, label: "Consultations", value: `${activities.filter(a => a.action_type === 'consultation').length}`, color: "primary" },
          { icon: AlertTriangle, label: "Issues Flagged", value: `${fieldEvents.filter(e => e.event_type === 'disease').length}`, color: "accent" },
          { icon: Target, label: "Active Cases", value: `${tasks.length}`, color: "navy" },
          { icon: Zap, label: "Recommendations", value: `${activities.filter(a => a.action_type === 'recommendation').length}`, color: "primary" }
        ];
      case "admin":
        return [
          { icon: Users, label: "Total Activity", value: `${activities.length}`, color: "primary" },
          { icon: Building, label: "Crop Plans", value: `${cropPlans.length}`, color: "accent" },
          { icon: Activity, label: "Field Events", value: `${fieldEvents.length}`, color: "navy" },
          { icon: AlertTriangle, label: "Open Tasks", value: `${tasks.length}`, color: "accent" }
        ];
      default: // farmer
        return [
          { icon: Wheat, label: t('dashboard.active_crops') || "Active Crops", value: `${cropPlans.filter(c => c.status === 'active' || c.status === 'planned').length}`, color: "primary" },
          { icon: Calendar, label: t('dashboard.upcoming_tasks') || "Upcoming Tasks", value: `${tasks.length}`, color: "accent" },
          { icon: TrendingUp, label: t('dashboard.field_events') || "Field Events", value: `${fieldEvents.length}`, color: "navy" },
          { icon: Award, label: t('dashboard.scheme_matches') || "Scheme Matches", value: `${schemeMatches.length}`, color: "primary" }
        ];
    }
  };

  const getQuickActions = () => {
    switch (userRole) {
      case "merchant":
        return [
          { icon: Users, label: "🤝 View Partner Farmers", color: "primary", description: "Connect with your farmer network", route: "/merchant/farmers" },
          { icon: TrendingUp, label: "📈 Market Prices", color: "secondary", description: "Stay ahead with market insights", route: "/merchant/market-prices" },
          { icon: Eye, label: "✅ Documents", color: "outline", description: "Review farmer documents", route: "/merchant/documents" },
          { icon: MessageSquare, label: "💬 Contact Farmers", color: "outline", description: "Build partnerships", route: "/merchant/farmers" }
        ];
      case "expert":
        return [
          { icon: Activity, label: "🔬 AI Crop Scanner", color: "primary", description: "Diagnose crop diseases", route: "/expert/ai-crop-scanner" },
          { icon: Brain, label: "🧠 AI Advisory", color: "secondary", description: "Expert recommendations", route: "/expert/ai-advisory" },
          { icon: MessageSquare, label: "🤖 AI Assistant", color: "outline", description: "Answer farmer questions", route: "/expert/chat" },
          { icon: BarChart3, label: "📊 Analytics", color: "outline", description: "Track AI performance", route: "/expert/dashboard" }
        ];
      case "admin":
        return [
          { icon: Users, label: "👥 Manage Users", color: "primary", description: "Oversee platform community", route: "/admin/users" },
          { icon: Settings, label: "⚙️ Configuration", color: "secondary", description: "Platform settings", route: "/admin/settings" },
          { icon: Award, label: "✅ Verifications", color: "outline", description: "Review approvals", route: "/admin/users" },
          { icon: BarChart3, label: "📊 Reports", color: "outline", description: "Generate analytics", route: "/admin/analytics" }
        ];
      default:
        return [
          { icon: Calendar, label: "🧭 Crop Planner", color: "primary", description: "Build season-wise crop plans", route: "/farmer/calendar" },
          { icon: Activity, label: "🛰️ Field History", color: "secondary", description: "Track field events", route: "/farmer/field-map" },
          { icon: Award, label: "🏛️ Scheme Wizard", color: "outline", description: "Match subsidies & credit", route: "/farmer/schemes" },
          { icon: MessageSquare, label: "🎓 Ask an Expert", color: "outline", description: "Get professional guidance", route: "/farmer/chat" }
        ];
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary": return { bg: "bg-primary/10", text: "text-primary", border: "border-l-primary" };
      case "accent": return { bg: "bg-accent/10", text: "text-accent", border: "border-l-accent" };
      case "navy": return { bg: "bg-navy/10", text: "text-navy", border: "border-l-navy" };
      default: return { bg: "bg-primary/10", text: "text-primary", border: "border-l-primary" };
    }
  };

  const getActivityIcon = (type: string) => {
    const map: Record<string, any> = {
      irrigation: Clock, weather: Calendar, fertilizer: Wheat, soil: Activity,
      consultation: MessageSquare, deal: ShoppingCart, recommendation: Brain,
      disease: AlertTriangle, harvest: Wheat, partnership: Users, system: Settings,
    };
    return map[type] || User;
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const overviewCards = getOverviewCards();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AshokaChakra size={28} animate={false} />
          <h1 className="text-3xl font-bold text-gradient-tricolor">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </h1>
        </div>
        <Badge variant="outline" className="text-sm border-primary/30 text-primary">
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((item, index) => {
          const colors = getColorClasses(item.color);
          return (
            <Card key={index} className={`tricolor-card border-l-4 ${colors.border}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                <div className={`p-2 rounded-full ${colors.bg}`}>
                  <item.icon className={`h-4 w-4 ${colors.text}`} />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold text-foreground">{item.value}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? <Skeleton className="h-3 w-24 mt-1" /> : "from your data"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity - from database */}
        <Card className="tricolor-card">
          <CardHeader>
            <CardTitle className="text-gradient-tricolor">{t('dashboard.recent_activity') || "Recent Activity"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))
            ) : activities.length > 0 ? (
              activities.slice(0, 5).map((activity) => {
                const ActivityIcon = getActivityIcon(activity.action_type);
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <ActivityIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.created_at)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('dashboard.no_activity') || "No activity yet. Start using the app!"}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="tricolor-card">
          <CardHeader>
            <CardTitle className="text-gradient-tricolor">{t('dashboard.quick_actions') || "Quick Actions"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.color as any}
                className="w-full justify-start h-auto p-4 transition-all duration-200 hover:translate-x-1"
                size="lg"
                onClick={() => navigate(action.route)}
              >
                <div className="flex items-center gap-3 w-full">
                  <action.icon className="h-5 w-5 text-primary" />
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{action.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">{action.description}</span>
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
