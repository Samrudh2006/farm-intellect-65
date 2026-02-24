import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Mic, BookOpen, Database, Cloud, Calendar, Bell } from "lucide-react";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { YieldProfitEstimator } from "@/components/features/YieldProfitEstimator";
import { VoiceAssistant } from "@/components/features/VoiceAssistant";
import { DigitalDiary } from "@/components/features/DigitalDiary";
import { KnowledgeHub } from "@/components/features/KnowledgeHub";
import { WeatherMarketAPI } from "@/components/features/WeatherMarketAPI";
import { CropCalendarReminder } from "@/components/features/CropCalendarReminder";

const FarmFeatures = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const features = [
    { id: "estimator", title: "AI Yield & Profit Estimator", description: "Calculate expected yield and profit for your crops", icon: Calculator, component: YieldProfitEstimator },
    { id: "voice", title: "Voice Assistant", description: "Ask questions and get answers in Hindi/Punjabi", icon: Mic, component: VoiceAssistant },
    { id: "diary", title: "Digital Farmer Diary", description: "Keep track of your farming activities", icon: Database, component: DigitalDiary },
    { id: "knowledge", title: "Knowledge Hub", description: "Learn from expert videos and articles", icon: BookOpen, component: KnowledgeHub },
    { id: "weather", title: "Weather & Market Data", description: "Live weather forecasts and mandi prices", icon: Cloud, component: WeatherMarketAPI },
    { id: "calendar", title: "Crop Calendar & Reminders", description: "Schedule and get reminders for farming activities", icon: Calendar, component: CropCalendarReminder }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onMenuClick={() => setSidebarOpen(!sidebarOpen)} notificationCount={3} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole={user.role || 'farmer'} />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <AshokaChakra size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gradient-tricolor">Smart Farm Features 🌾</h1>
            <p className="text-muted-foreground text-lg mt-2">Advanced tools to help you farm smarter and earn more</p>
          </div>

          <Tabs defaultValue="estimator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {features.map((feature) => (
                <TabsTrigger key={feature.id} value={feature.id} className="flex flex-col gap-1 h-16">
                  <feature.icon className="h-5 w-5" />
                  <span className="text-xs">{feature.title.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {features.map((feature) => (
              <TabsContent key={feature.id} value={feature.id}>
                <Card className="tricolor-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gradient-tricolor">
                      <feature.icon className="h-6 w-6 text-primary" />
                      {feature.title}
                    </CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardHeader>
                  <CardContent>
                    <feature.component />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          {/* PWA Install Prompt */}
          <Card className="tricolor-card bg-gradient-to-r from-accent/5 via-background to-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 glow-green">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Install Farm Intellect App</h3>
                  <p className="text-sm text-muted-foreground">
                    Install this app on your phone for offline access and notifications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FarmFeatures;
