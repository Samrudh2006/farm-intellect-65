import { Suspense, lazy, type ComponentType, type LazyExoticComponent, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/layout/PageTransition";
import { AppErrorBoundary } from "@/components/system/AppErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FarmerDashboard = lazy(() => import("./pages/FarmerDashboard"));
const MerchantDashboardPage = lazy(() => import("./pages/MerchantDashboardPage"));
const ExpertDashboardPage = lazy(() => import("./pages/ExpertDashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const Login = lazy(() => import("./pages/Login"));
const Crops = lazy(() => import("./pages/Crops"));
const Advisory = lazy(() => import("./pages/Advisory"));
const Weather = lazy(() => import("./pages/Weather"));
const Sensors = lazy(() => import("./pages/Sensors"));
const FieldMap = lazy(() => import("./pages/FieldMap"));
const Merchants = lazy(() => import("./pages/Merchants"));
const Polls = lazy(() => import("./pages/Polls"));
const Schemes = lazy(() => import("./pages/Schemes"));
const AIAdvisory = lazy(() => import("./pages/AIAdvisory"));
const AICropScanner = lazy(() => import("./pages/AICropScanner"));
const Farmers = lazy(() => import("./pages/Farmers"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Forum = lazy(() => import("./pages/Forum"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Documents = lazy(() => import("./pages/Documents"));
const Chat = lazy(() => import("./pages/Chat"));
const FarmFeatures = lazy(() => import("./pages/FarmFeatures"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const MerchantFarmers = lazy(() => import("./pages/merchant/MerchantFarmers"));
const MerchantMarketPrices = lazy(() => import("./pages/merchant/MerchantMarketPrices"));
const MerchantDocuments = lazy(() => import("./pages/merchant/MerchantDocuments"));
const MerchantNotifications = lazy(() => import("./pages/merchant/MerchantNotifications"));

const ExpertAICropScanner = lazy(() => import("./pages/expert/ExpertAICropScanner"));
const ExpertAIAdvisory = lazy(() => import("./pages/expert/ExpertAIAdvisory"));
const ExpertChat = lazy(() => import("./pages/expert/ExpertChat"));
const ExpertNotifications = lazy(() => import("./pages/expert/ExpertNotifications"));

const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminNotifications = lazy(() => import("./pages/admin/AdminNotifications"));

const queryClient = new QueryClient();

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <span className="h-8 w-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const renderPage = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<RouteLoader />}>
    <PageTransition>
      <Component />
    </PageTransition>
  </Suspense>
);

const renderProtectedPage = (Component: LazyExoticComponent<ComponentType>) => (
  <ProtectedRoute>{renderPage(Component)}</ProtectedRoute>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={renderPage(Index)} />
        <Route path="/login" element={renderPage(Login)} />
        <Route path="/reset-password" element={renderPage(ResetPassword)} />
        
        {/* Farmer Routes */}
        <Route path="/farmer/dashboard" element={renderProtectedPage(FarmerDashboard)} />
        <Route path="/farmer/crops" element={renderProtectedPage(Crops)} />
        <Route path="/farmer/advisory" element={renderProtectedPage(Advisory)} />
        <Route path="/farmer/weather" element={renderProtectedPage(Weather)} />
        <Route path="/farmer/sensors" element={renderProtectedPage(Sensors)} />
        <Route path="/farmer/field-map" element={renderProtectedPage(FieldMap)} />
        <Route path="/farmer/merchants" element={renderProtectedPage(Merchants)} />
        <Route path="/farmer/polls" element={renderProtectedPage(Polls)} />
        <Route path="/farmer/schemes" element={renderProtectedPage(Schemes)} />
        <Route path="/farmer/ai-advisory" element={renderProtectedPage(AIAdvisory)} />
        <Route path="/farmer/ai-crop-scanner" element={renderProtectedPage(AICropScanner)} />
        <Route path="/farmer/chat" element={renderProtectedPage(Chat)} />
        <Route path="/farmer/forum" element={renderProtectedPage(Forum)} />
        <Route path="/farmer/calendar" element={renderProtectedPage(Calendar)} />
        <Route path="/farmer/documents" element={renderProtectedPage(Documents)} />
        <Route path="/farmer/notifications" element={renderProtectedPage(Notifications)} />
        <Route path="/farmer/features" element={renderProtectedPage(FarmFeatures)} />
        <Route path="/farmer/profile" element={renderProtectedPage(Profile)} />
        
        {/* Merchant Routes */}
        <Route path="/merchant/dashboard" element={renderProtectedPage(MerchantDashboardPage)} />
        <Route path="/merchant/farmers" element={renderProtectedPage(MerchantFarmers)} />
        <Route path="/merchant/market-prices" element={renderProtectedPage(MerchantMarketPrices)} />
        <Route path="/merchant/documents" element={renderProtectedPage(MerchantDocuments)} />
        <Route path="/merchant/notifications" element={renderProtectedPage(MerchantNotifications)} />
        <Route path="/merchant/profile" element={renderProtectedPage(Profile)} />
        
        {/* Expert Routes */}
        <Route path="/expert/dashboard" element={renderProtectedPage(ExpertDashboardPage)} />
        <Route path="/expert/ai-crop-scanner" element={renderProtectedPage(ExpertAICropScanner)} />
        <Route path="/expert/ai-advisory" element={renderProtectedPage(ExpertAIAdvisory)} />
        <Route path="/expert/chat" element={renderProtectedPage(ExpertChat)} />
        <Route path="/expert/notifications" element={renderProtectedPage(ExpertNotifications)} />
        <Route path="/expert/profile" element={renderProtectedPage(Profile)} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={renderProtectedPage(AdminDashboardPage)} />
        <Route path="/admin/users" element={renderProtectedPage(AdminUsers)} />
        <Route path="/admin/analytics" element={renderProtectedPage(AdminAnalytics)} />
        <Route path="/admin/settings" element={renderProtectedPage(AdminSettings)} />
        <Route path="/admin/notifications" element={renderProtectedPage(AdminNotifications)} />
        <Route path="/admin/profile" element={renderProtectedPage(Profile)} />
        
        {/* Legacy Routes */}
        <Route path="/dashboard" element={renderProtectedPage(Dashboard)} />
        <Route path="/crops" element={renderProtectedPage(Crops)} />
        <Route path="/advisory" element={renderProtectedPage(Advisory)} />
        <Route path="/weather" element={renderProtectedPage(Weather)} />
        <Route path="/sensors" element={renderProtectedPage(Sensors)} />
        <Route path="/field-map" element={renderProtectedPage(FieldMap)} />
        <Route path="/merchants" element={renderProtectedPage(Merchants)} />
        <Route path="/polls" element={renderProtectedPage(Polls)} />
        <Route path="/schemes" element={renderProtectedPage(Schemes)} />
        <Route path="/ai-advisory" element={renderProtectedPage(AIAdvisory)} />
        <Route path="/ai-crop-scanner" element={renderProtectedPage(AICropScanner)} />
        <Route path="/farmers" element={renderProtectedPage(Farmers)} />
        <Route path="/analytics" element={renderProtectedPage(Analytics)} />
        <Route path="/users" element={renderProtectedPage(Users)} />
        <Route path="/settings" element={renderProtectedPage(Settings)} />
        <Route path="/forum" element={renderProtectedPage(Forum)} />
        <Route path="/calendar" element={renderProtectedPage(Calendar)} />
        <Route path="/notifications" element={renderProtectedPage(Notifications)} />
        <Route path="/documents" element={renderProtectedPage(Documents)} />
        <Route path="/chat" element={renderProtectedPage(Chat)} />
        <Route path="*" element={renderPage(NotFound)} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppErrorBoundary>
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
    </AppErrorBoundary>
  </QueryClientProvider>
);

export default App;
