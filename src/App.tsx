import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import MerchantDashboard from "./pages/MerchantDashboard";
import MerchantDashboardPage from "./pages/MerchantDashboardPage";
import ExpertDashboard from "./pages/ExpertDashboard";
import ExpertDashboardPage from "./pages/ExpertDashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Login from "./pages/Login";
import Crops from "./pages/Crops";
import Advisory from "./pages/Advisory";
import Weather from "./pages/Weather";
import Sensors from "./pages/Sensors";
import FieldMap from "./pages/FieldMap";
import Merchants from "./pages/Merchants";
import Polls from "./pages/Polls";
import Schemes from "./pages/Schemes";
import AIAdvisory from "./pages/AIAdvisory";
import AICropScanner from "./pages/AICropScanner";
import Farmers from "./pages/Farmers";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Forum from "./pages/Forum";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import Documents from "./pages/Documents";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Farmer Routes */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/crops" element={<Crops />} />
            <Route path="/farmer/advisory" element={<Advisory />} />
            <Route path="/farmer/weather" element={<Weather />} />
            <Route path="/farmer/sensors" element={<Sensors />} />
            <Route path="/farmer/field-map" element={<FieldMap />} />
            <Route path="/farmer/merchants" element={<Merchants />} />
            <Route path="/farmer/polls" element={<Polls />} />
            <Route path="/farmer/schemes" element={<Schemes />} />
            <Route path="/farmer/ai-advisory" element={<AIAdvisory />} />
            <Route path="/farmer/chat" element={<Chat />} />
            <Route path="/farmer/forum" element={<Forum />} />
            <Route path="/farmer/calendar" element={<Calendar />} />
            <Route path="/farmer/documents" element={<Documents />} />
            <Route path="/farmer/notifications" element={<Notifications />} />
            
            {/* Merchant Routes */}
            <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
            <Route path="/merchant/farmers" element={<Farmers />} />
            <Route path="/merchant/market-prices" element={<Merchants />} />
            <Route path="/merchant/documents" element={<Documents />} />
            <Route path="/merchant/notifications" element={<Notifications />} />
            
            {/* Expert Routes */}
            <Route path="/expert/dashboard" element={<ExpertDashboardPage />} />
            <Route path="/expert/ai-crop-scanner" element={<AICropScanner />} />
            <Route path="/expert/ai-advisory" element={<AIAdvisory />} />
            <Route path="/expert/chat" element={<Chat />} />
            <Route path="/expert/notifications" element={<Notifications />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/notifications" element={<Notifications />} />
            
            {/* Legacy Routes - Redirect to role-specific routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/field-map" element={<FieldMap />} />
            <Route path="/merchants" element={<Merchants />} />
            <Route path="/polls" element={<Polls />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/ai-advisory" element={<AIAdvisory />} />
            <Route path="/ai-crop-scanner" element={<AICropScanner />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/chat" element={<Chat />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
