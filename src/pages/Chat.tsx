import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { AIChatbot } from "@/components/chat/AIChatbot";
import { useLanguage } from "@/contexts/LanguageContext";

const Chat = () => {
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
          <div>
            <h2 className="text-3xl font-bold text-foreground">AI Assistant</h2>
            <p className="text-muted-foreground">
              Get instant help and expert advice from our AI-powered farming assistant
            </p>
          </div>
          <AIChatbot />
        </div>
      </main>
    </div>
  );
};

export default Chat;