import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";

const AdminDashboardPage = () => {
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
        notificationCount={2}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-tricolor">
              Welcome back, System Guardian! 🛡
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Keeping our farming community running smoothly!
            </p>
            <div className="tricolor-bar h-0.5 max-w-xs mx-auto mt-4 rounded-full" />
          </div>
          
          <RoleDashboard userRole="admin" />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;