import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wheat, Mail, Lock, User, Phone, MapPin, UserCheck, Store, GraduationCap, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";
import heroImage from "@/assets/hero-farming.jpg";

const Login = () => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    location: "",
    role: "farmer",
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setFormData({ ...formData, role });
    setIsLogin(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app would authenticate with backend
    console.log("Login attempt:", { ...formData, role: selectedRole });
    
    // Redirect to role-specific dashboard
    const dashboardRoutes = {
      farmer: "/farmer/dashboard",
      merchant: "/merchant/dashboard", 
      expert: "/expert/dashboard",
      admin: "/admin/dashboard"
    };
    
    const route = dashboardRoutes[selectedRole as keyof typeof dashboardRoutes] || "/farmer/dashboard";
    window.location.href = route;
  };

  const roleCards = [
    {
      role: 'farmer',
      title: t('auth.signin_farmer'),
      icon: UserCheck,
      description: 'Manage crops, get AI recommendations, connect with merchants',
      color: 'text-green-600 bg-green-50'
    },
    {
      role: 'merchant',
      title: t('auth.signin_merchant'),
      icon: Store,
      description: 'Connect with farmers, manage purchases, set crop prices',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      role: 'expert',
      title: t('auth.signin_expert'),
      icon: GraduationCap,
      description: 'Provide advisory services, share agricultural expertise',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      role: 'admin',
      title: t('auth.signin_admin'),
      icon: Shield,
      description: 'Manage system, oversee all operations and users',
      color: 'text-red-600 bg-red-50'
    }
  ];

  // Show role selection if no role is selected
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          {/* Language Selector */}
          <div className="flex justify-end mb-8">
            <LanguageSelector />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Wheat className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Smart Crop Advisory</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('auth.welcome')}
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roleCards.map((card) => (
              <Card 
                key={card.role}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleRoleSelect(card.role)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${card.color} flex items-center justify-center mx-auto mb-4`}>
                    <card.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">
                    {t('common.continue')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Back to role selection */}
          <Button 
            variant="ghost" 
            onClick={() => setSelectedRole(null)}
            className="mb-4"
          >
            ← Back to role selection
          </Button>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Wheat className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Smart Crop Advisory</h1>
          </div>

          <Card>
            <CardHeader className="text-center">
              <CardTitle>
                {isLogin ? t('dashboard.welcome') : t('auth.signup')}
              </CardTitle>
              <CardDescription>
                {selectedRole && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {roleCards.find(r => r.role === selectedRole)?.icon && (
                      <div className={`p-2 rounded-full ${roleCards.find(r => r.role === selectedRole)?.color}`}>
                        {(() => {
                          const IconComponent = roleCards.find(r => r.role === selectedRole)?.icon;
                          return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                        })()}
                      </div>
                    )}
                    <span className="font-medium">{roleCards.find(r => r.role === selectedRole)?.title}</span>
                  </div>
                )}
                {isLogin 
                  ? "Sign in to access your dashboard" 
                  : "Join our smart farming community"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('auth.fullname')}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          className="pl-10"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('auth.phone')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{t('auth.location')}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          type="text"
                          placeholder="Enter your location"
                          className="pl-10"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>


                <Button type="submit" className="w-full">
                  {isLogin ? t('auth.signin') : t('auth.signup')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-primary hover:underline"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:block relative">
        <img
          src={heroImage}
          alt="Smart farming technology with crops and sensors"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Smart Farming Solutions</h2>
          <p className="text-lg text-white/90">
            Harness the power of AI and IoT to optimize your crop yields
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;