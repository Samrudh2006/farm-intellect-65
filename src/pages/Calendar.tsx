import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CropCalendar } from "@/components/calendar/CropCalendar";
import { useLanguage } from "@/contexts/LanguageContext";

const Calendar = () => {
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
        <CropCalendar />
      </main>
    </div>
  );
};

export default Calendar;