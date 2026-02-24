import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";

const FarmerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = { name: "Rajesh Kumar", role: "farmer" };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} notificationCount={5} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole={user.role} />
      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-tricolor">Welcome back, Farmer! 🚜</h1>
            <p className="text-muted-foreground text-lg mt-2">Let's make today a great day for your farm!</p>
            <div className="tricolor-bar h-0.5 max-w-xs mx-auto mt-4 rounded-full" />
          </div>
          <RoleDashboard userRole="farmer" />
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
