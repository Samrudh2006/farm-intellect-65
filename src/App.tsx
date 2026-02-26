import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PageTransition } from "@/components/layout/PageTransition";
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
import FarmFeatures from "./pages/FarmFeatures";

// Role-specific imports
import MerchantFarmers from "./pages/merchant/MerchantFarmers";
import MerchantMarketPrices from "./pages/merchant/MerchantMarketPrices";
import MerchantDocuments from "./pages/merchant/MerchantDocuments";
import MerchantNotifications from "./pages/merchant/MerchantNotifications";

import ExpertAICropScanner from "./pages/expert/ExpertAICropScanner";
import ExpertAIAdvisory from "./pages/expert/ExpertAIAdvisory";
import ExpertChat from "./pages/expert/ExpertChat";
import ExpertNotifications from "./pages/expert/ExpertNotifications";

import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminNotifications from "./pages/admin/AdminNotifications";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        
        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<PageTransition><FarmerDashboard /></PageTransition>} />
        <Route path="/farmer/crops" element={<PageTransition><Crops /></PageTransition>} />
        <Route path="/farmer/advisory" element={<PageTransition><Advisory /></PageTransition>} />
        <Route path="/farmer/weather" element={<PageTransition><Weather /></PageTransition>} />
        <Route path="/farmer/sensors" element={<PageTransition><Sensors /></PageTransition>} />
        <Route path="/farmer/field-map" element={<PageTransition><FieldMap /></PageTransition>} />
        <Route path="/farmer/merchants" element={<PageTransition><Merchants /></PageTransition>} />
        <Route path="/farmer/polls" element={<PageTransition><Polls /></PageTransition>} />
        <Route path="/farmer/schemes" element={<PageTransition><Schemes /></PageTransition>} />
        <Route path="/farmer/ai-advisory" element={<PageTransition><AIAdvisory /></PageTransition>} />
        <Route path="/farmer/chat" element={<PageTransition><Chat /></PageTransition>} />
        <Route path="/farmer/forum" element={<PageTransition><Forum /></PageTransition>} />
        <Route path="/farmer/calendar" element={<PageTransition><Calendar /></PageTransition>} />
        <Route path="/farmer/documents" element={<PageTransition><Documents /></PageTransition>} />
        <Route path="/farmer/notifications" element={<PageTransition><Notifications /></PageTransition>} />
        <Route path="/farmer/features" element={<PageTransition><FarmFeatures /></PageTransition>} />
        
        {/* Merchant Routes */}
        <Route path="/merchant/dashboard" element={<PageTransition><MerchantDashboardPage /></PageTransition>} />
        <Route path="/merchant/farmers" element={<PageTransition><MerchantFarmers /></PageTransition>} />
        <Route path="/merchant/market-prices" element={<PageTransition><MerchantMarketPrices /></PageTransition>} />
        <Route path="/merchant/documents" element={<PageTransition><MerchantDocuments /></PageTransition>} />
        <Route path="/merchant/notifications" element={<PageTransition><MerchantNotifications /></PageTransition>} />
        
        {/* Expert Routes */}
        <Route path="/expert/dashboard" element={<PageTransition><ExpertDashboardPage /></PageTransition>} />
        <Route path="/expert/ai-crop-scanner" element={<PageTransition><ExpertAICropScanner /></PageTransition>} />
        <Route path="/expert/ai-advisory" element={<PageTransition><ExpertAIAdvisory /></PageTransition>} />
        <Route path="/expert/chat" element={<PageTransition><ExpertChat /></PageTransition>} />
        <Route path="/expert/notifications" element={<PageTransition><ExpertNotifications /></PageTransition>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PageTransition><AdminDashboardPage /></PageTransition>} />
        <Route path="/admin/users" element={<PageTransition><AdminUsers /></PageTransition>} />
        <Route path="/admin/analytics" element={<PageTransition><AdminAnalytics /></PageTransition>} />
        <Route path="/admin/settings" element={<PageTransition><AdminSettings /></PageTransition>} />
        <Route path="/admin/notifications" element={<PageTransition><AdminNotifications /></PageTransition>} />
        
        {/* Legacy Routes */}
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/crops" element={<PageTransition><Crops /></PageTransition>} />
        <Route path="/advisory" element={<PageTransition><Advisory /></PageTransition>} />
        <Route path="/weather" element={<PageTransition><Weather /></PageTransition>} />
        <Route path="/sensors" element={<PageTransition><Sensors /></PageTransition>} />
        <Route path="/field-map" element={<PageTransition><FieldMap /></PageTransition>} />
        <Route path="/merchants" element={<PageTransition><Merchants /></PageTransition>} />
        <Route path="/polls" element={<PageTransition><Polls /></PageTransition>} />
        <Route path="/schemes" element={<PageTransition><Schemes /></PageTransition>} />
        <Route path="/ai-advisory" element={<PageTransition><AIAdvisory /></PageTransition>} />
        <Route path="/ai-crop-scanner" element={<PageTransition><AICropScanner /></PageTransition>} />
        <Route path="/farmers" element={<PageTransition><Farmers /></PageTransition>} />
        <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
        <Route path="/users" element={<PageTransition><Users /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/forum" element={<PageTransition><Forum /></PageTransition>} />
        <Route path="/calendar" element={<PageTransition><Calendar /></PageTransition>} />
        <Route path="/notifications" element={<PageTransition><Notifications /></PageTransition>} />
        <Route path="/documents" element={<PageTransition><Documents /></PageTransition>} />
        <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
