import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const MerchantDocuments = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useCurrentUser();

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
            <h1 className="text-4xl font-bold text-gradient-saffron-navy">
              📄 Business Documents Hub
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Manage contracts, certificates, and partnership agreements
            </p>
          </div>
          
          <DocumentUpload />
        </div>
      </main>
    </div>
  );
};

export default MerchantDocuments;