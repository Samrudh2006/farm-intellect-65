import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommunityForum } from "@/components/forum/CommunityForum";
import { useLanguage } from "@/contexts/LanguageContext";

const Forum = () => {
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
        <CommunityForum />
      </main>
    </div>
  );
};

export default Forum;