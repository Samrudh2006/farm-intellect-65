import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { EnhancedAnalytics } from "@/components/analytics/EnhancedAnalytics";

const AdminAnalytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "Admin User",
    role: "admin",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={3}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              📊 Platform Analytics Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Comprehensive insights into platform performance and user engagement
            </p>
          </div>
          
          <EnhancedAnalytics />
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;