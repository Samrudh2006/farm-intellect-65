import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

const ExpertNotifications = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "Expert User",
    role: "expert",
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              🔔 Expert Notifications
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Stay informed about research updates and consultation requests
            </p>
          </div>
          
          <NotificationCenter />
        </div>
      </main>
    </div>
  );
};

export default ExpertNotifications;