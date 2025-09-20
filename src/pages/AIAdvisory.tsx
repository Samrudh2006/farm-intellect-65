import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CropRecommendationEngine from "@/components/ai/CropRecommendationEngine";
import YieldPredictor from "@/components/analytics/YieldPredictor";
import { useLanguage } from "@/contexts/LanguageContext";

const AIAdvisory = () => {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "John Farmer",
    role: "farmer",
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
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">AI-Powered Advisory</h2>
            <p className="text-muted-foreground">
              Get intelligent crop recommendations and yield predictions powered by advanced AI
            </p>
          </div>

          <Tabs defaultValue="recommendations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="recommendations">Crop Recommendations</TabsTrigger>
              <TabsTrigger value="predictions">Yield Predictions</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations">
              <CropRecommendationEngine />
            </TabsContent>

            <TabsContent value="predictions">
              <YieldPredictor />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AIAdvisory;