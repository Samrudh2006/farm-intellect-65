import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        
        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={<ProtectedRoute><PageTransition><FarmerDashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/crops" element={<ProtectedRoute><PageTransition><Crops /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/advisory" element={<ProtectedRoute><PageTransition><Advisory /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/weather" element={<ProtectedRoute><PageTransition><Weather /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/sensors" element={<ProtectedRoute><PageTransition><Sensors /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/field-map" element={<ProtectedRoute><PageTransition><FieldMap /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/merchants" element={<ProtectedRoute><PageTransition><Merchants /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/polls" element={<ProtectedRoute><PageTransition><Polls /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/schemes" element={<ProtectedRoute><PageTransition><Schemes /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/ai-advisory" element={<ProtectedRoute><PageTransition><AIAdvisory /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/chat" element={<ProtectedRoute><PageTransition><Chat /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/forum" element={<ProtectedRoute><PageTransition><Forum /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/calendar" element={<ProtectedRoute><PageTransition><Calendar /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/documents" element={<ProtectedRoute><PageTransition><Documents /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/notifications" element={<ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/features" element={<ProtectedRoute><PageTransition><FarmFeatures /></PageTransition></ProtectedRoute>} />
        <Route path="/farmer/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        
        {/* Merchant Routes */}
        <Route path="/merchant/dashboard" element={<ProtectedRoute><PageTransition><MerchantDashboardPage /></PageTransition></ProtectedRoute>} />
        <Route path="/merchant/farmers" element={<ProtectedRoute><PageTransition><MerchantFarmers /></PageTransition></ProtectedRoute>} />
        <Route path="/merchant/market-prices" element={<ProtectedRoute><PageTransition><MerchantMarketPrices /></PageTransition></ProtectedRoute>} />
        <Route path="/merchant/documents" element={<ProtectedRoute><PageTransition><MerchantDocuments /></PageTransition></ProtectedRoute>} />
        <Route path="/merchant/notifications" element={<ProtectedRoute><PageTransition><MerchantNotifications /></PageTransition></ProtectedRoute>} />
        <Route path="/merchant/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        
        {/* Expert Routes */}
        <Route path="/expert/dashboard" element={<ProtectedRoute><PageTransition><ExpertDashboardPage /></PageTransition></ProtectedRoute>} />
        <Route path="/expert/ai-crop-scanner" element={<ProtectedRoute><PageTransition><ExpertAICropScanner /></PageTransition></ProtectedRoute>} />
        <Route path="/expert/ai-advisory" element={<ProtectedRoute><PageTransition><ExpertAIAdvisory /></PageTransition></ProtectedRoute>} />
        <Route path="/expert/chat" element={<ProtectedRoute><PageTransition><ExpertChat /></PageTransition></ProtectedRoute>} />
        <Route path="/expert/notifications" element={<ProtectedRoute><PageTransition><ExpertNotifications /></PageTransition></ProtectedRoute>} />
        <Route path="/expert/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute><PageTransition><AdminDashboardPage /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><PageTransition><AdminUsers /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><PageTransition><AdminAnalytics /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><PageTransition><AdminSettings /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute><PageTransition><AdminNotifications /></PageTransition></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
        
        {/* Legacy Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/crops" element={<ProtectedRoute><PageTransition><Crops /></PageTransition></ProtectedRoute>} />
        <Route path="/advisory" element={<ProtectedRoute><PageTransition><Advisory /></PageTransition></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><PageTransition><Weather /></PageTransition></ProtectedRoute>} />
        <Route path="/sensors" element={<ProtectedRoute><PageTransition><Sensors /></PageTransition></ProtectedRoute>} />
        <Route path="/field-map" element={<ProtectedRoute><PageTransition><FieldMap /></PageTransition></ProtectedRoute>} />
        <Route path="/merchants" element={<ProtectedRoute><PageTransition><Merchants /></PageTransition></ProtectedRoute>} />
        <Route path="/polls" element={<ProtectedRoute><PageTransition><Polls /></PageTransition></ProtectedRoute>} />
        <Route path="/schemes" element={<ProtectedRoute><PageTransition><Schemes /></PageTransition></ProtectedRoute>} />
        <Route path="/ai-advisory" element={<ProtectedRoute><PageTransition><AIAdvisory /></PageTransition></ProtectedRoute>} />
        <Route path="/ai-crop-scanner" element={<ProtectedRoute><PageTransition><AICropScanner /></PageTransition></ProtectedRoute>} />
        <Route path="/farmers" element={<ProtectedRoute><PageTransition><Farmers /></PageTransition></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><PageTransition><Analytics /></PageTransition></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute><PageTransition><Users /></PageTransition></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
        <Route path="/forum" element={<ProtectedRoute><PageTransition><Forum /></PageTransition></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><PageTransition><Calendar /></PageTransition></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>} />
        <Route path="/documents" element={<ProtectedRoute><PageTransition><Documents /></PageTransition></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><PageTransition><Chat /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
