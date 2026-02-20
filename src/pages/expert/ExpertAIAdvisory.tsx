import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import CropRecommendationEngine from "@/components/ai/CropRecommendationEngine";
import { AdvancedFeaturesShowcase } from "@/components/features/AdvancedFeaturesShowcase";

const ExpertAIAdvisory = () => {
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
            <h1 className="text-4xl font-bold text-gradient-tricolor">
              🧠 Expert AI Advisory Engine
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Advanced agricultural intelligence for expert recommendations
            </p>
          </div>
          
          <CropRecommendationEngine />
          <AdvancedFeaturesShowcase />
        </div>
      </main>
    </div>
  );
};

export default ExpertAIAdvisory;