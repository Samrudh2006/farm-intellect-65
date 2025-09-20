import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Wheat, 
  CloudSun, 
  Users, 
  TrendingUp, 
  Settings,
  BookOpen,
  Activity,
  Map,
  Brain,
  MessageSquare,
  Calendar,
  Bell,
  FileText,
  Bot,
  Gauge,
  Vote,
  Building,
  Landmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const navigationItems = {
  farmer: [
    { icon: LayoutDashboard, label: "🏠 My Farm Hub", href: "/farmer/dashboard" },
    { icon: Wheat, label: "🌾 My Crops", href: "/farmer/crops" },
    { icon: BookOpen, label: "📚 Advisory", href: "/farmer/advisory" },
    { icon: CloudSun, label: "🌤 Weather", href: "/farmer/weather" },
    { icon: Gauge, label: "📡 Sensors", href: "/farmer/sensors" },
    { icon: Map, label: "🗺 Field Map", href: "/farmer/field-map" },
    { icon: Building, label: "🏪 Merchants", href: "/farmer/merchants" },
    { icon: Vote, label: "🗳 Polls", href: "/farmer/polls" },
    { icon: Landmark, label: "🏛 Gov Schemes", href: "/farmer/schemes" },
    { icon: Brain, label: "🧠 AI Advisory", href: "/farmer/ai-advisory" },
    { icon: Bot, label: "🤖 AI Assistant", href: "/farmer/chat" },
    { icon: MessageSquare, label: "💬 Forum", href: "/farmer/forum" },
    { icon: Calendar, label: "📅 Crop Calendar", href: "/farmer/calendar" },
    { icon: FileText, label: "📄 Documents", href: "/farmer/documents" },
    { icon: Bell, label: "🔔 Notifications", href: "/farmer/notifications" },
  ],
  merchant: [
    { icon: LayoutDashboard, label: "🏢 Business Hub", href: "/merchant/dashboard" },
    { icon: Users, label: "🤝 Partner Farmers", href: "/merchant/farmers" },
    { icon: TrendingUp, label: "📈 Market Prices", href: "/merchant/market-prices" },
    { icon: FileText, label: "📄 Documents", href: "/merchant/documents" },
    { icon: Bell, label: "🔔 Notifications", href: "/merchant/notifications" },
  ],
  expert: [
    { icon: LayoutDashboard, label: "🎓 Expert Hub", href: "/expert/dashboard" },
    { icon: Activity, label: "🔬 AI Crop Scanner", href: "/expert/ai-crop-scanner" },
    { icon: Brain, label: "🧠 AI Advisory", href: "/expert/ai-advisory" },
    { icon: Bot, label: "🤖 AI Assistant", href: "/expert/chat" },
    { icon: Bell, label: "🔔 Notifications", href: "/expert/notifications" },
  ],
  admin: [
    { icon: LayoutDashboard, label: "🛡 Admin Center", href: "/admin/dashboard" },
    { icon: Users, label: "👥 Users", href: "/admin/users" },
    { icon: TrendingUp, label: "📊 Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "⚙️ Settings", href: "/admin/settings" },
    { icon: Bell, label: "🔔 Notifications", href: "/admin/notifications" },
  ],
};

export const Sidebar = ({ isOpen, onClose, userRole = "farmer" }: SidebarProps) => {
  const items = navigationItems[userRole as keyof typeof navigationItems] || navigationItems.farmer;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 transform border-r border-border bg-card transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4">
          {/* Role-specific welcome message */}
          <div className="mb-6 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
            <h3 className="font-semibold text-sm text-primary mb-1">
              {userRole === 'farmer' && '🚜 Farmer Portal'}
              {userRole === 'merchant' && '🤝 Business Hub'}
              {userRole === 'expert' && '🎓 Expert Center'}
              {userRole === 'admin' && '🛡 Admin Control'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {userRole === 'farmer' && 'Your farm management toolkit'}
              {userRole === 'merchant' && 'Partner farmer connections'}
              {userRole === 'expert' && 'AI-powered expertise'}
              {userRole === 'admin' && 'Platform administration'}
            </p>
          </div>
          
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:scale-105",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};