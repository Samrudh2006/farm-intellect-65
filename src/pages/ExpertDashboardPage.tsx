import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const ExpertDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useCurrentUser();

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={8}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Welcome back, Agricultural Expert! 🌾
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Ready to share your wisdom and help farmers thrive?
            </p>
          </div>
          
          <RoleDashboard userRole="expert" />
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboardPage;