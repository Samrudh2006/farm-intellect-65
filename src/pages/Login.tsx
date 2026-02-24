import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wheat, Mail, Lock, User, Phone, MapPin, UserCheck, Store, GraduationCap, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
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
    console.log("Login attempt:", { ...formData, role: selectedRole });
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
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      role: 'merchant',
      title: t('auth.signin_merchant'),
      icon: Store,
      description: 'Connect with farmers, manage purchases, set crop prices',
      iconBg: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      role: 'expert',
      title: t('auth.signin_expert'),
      icon: GraduationCap,
      description: 'Provide advisory services, share agricultural expertise',
      iconBg: 'bg-navy/10',
      iconColor: 'text-navy',
    },
    {
      role: 'admin',
      title: t('auth.signin_admin'),
      icon: Shield,
      description: 'Manage system, oversee all operations and users',
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
    }
  ];

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background">
        <div className="tricolor-bar h-1.5" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-8">
            <LanguageSelector />
          </div>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AshokaChakra size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gradient-tricolor mb-2">Smart Crop Advisory</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('auth.welcome')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roleCards.map((card) => (
              <Card 
                key={card.role}
                className="tricolor-card cursor-pointer"
                onClick={() => handleRoleSelect(card.role)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full ${card.iconBg} flex items-center justify-center mx-auto mb-4`}>
                    <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {t('common.continue')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="tricolor-bar h-1.5 mt-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          <Button variant="ghost" onClick={() => setSelectedRole(null)} className="mb-4">
            ← Back to role selection
          </Button>

          <div className="flex items-center justify-center gap-3 mb-8">
            <AshokaChakra size={36} />
            <h1 className="text-2xl font-bold text-gradient-tricolor">Smart Crop Advisory</h1>
          </div>

          <Card className="tricolor-card">
            <CardHeader className="text-center">
              <CardTitle>{isLogin ? t('dashboard.welcome') : t('auth.signup')}</CardTitle>
              <CardDescription>
                {selectedRole && (
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className={`p-2 rounded-full ${roleCards.find(r => r.role === selectedRole)?.iconBg}`}>
                      {(() => {
                        const IconComponent = roleCards.find(r => r.role === selectedRole)?.icon;
                        return IconComponent ? <IconComponent className={`h-4 w-4 ${roleCards.find(r => r.role === selectedRole)?.iconColor}`} /> : null;
                      })()}
                    </div>
                    <span className="font-medium">{roleCards.find(r => r.role === selectedRole)?.title}</span>
                  </div>
                )}
                {isLogin ? "Sign in to access your dashboard" : "Join our smart farming community"}
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
                        <Input id="name" type="text" placeholder="Enter your full name" className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('auth.phone')}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder="Enter your phone number" className="pl-10" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t('auth.location')}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="location" type="text" placeholder="Enter your location" className="pl-10" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="Enter your email" className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="Enter your password" className="pl-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {isLogin ? t('auth.signin') : t('auth.signup')}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block relative">
        <img src={heroImage} alt="Smart farming technology with crops and sensors" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-3 mb-3">
            <AshokaChakra size={32} animate={false} className="drop-shadow-lg [&_circle]:fill-white [&_line]:stroke-white" />
            <h2 className="text-3xl font-bold text-white">Smart Farming Solutions</h2>
          </div>
          <p className="text-lg text-white/90">
            Harness the power of AI and IoT to optimize your crop yields 🇮🇳
          </p>
          <div className="tricolor-bar h-1 mt-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default Login;
