import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, Eye, EyeOff, Smartphone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import heroImage from "@/assets/hero-farming.jpg";
import farmerImg from "@/assets/roles/farmer-role.jpg";
import merchantImg from "@/assets/roles/merchant-role.jpg";
import expertImg from "@/assets/roles/expert-role.jpg";
import adminImg from "@/assets/roles/admin-role.jpg";

interface StoredUser {
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
  location?: string;
}

const getRegisteredUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem("registeredUsers") || "[]");
  } catch {
    return [];
  }
};

const saveRegisteredUser = (user: StoredUser) => {
  const users = getRegisteredUsers();
  const exists = users.find(u => u.email === user.email && u.role === user.role);
  if (exists) return false;
  users.push(user);
  localStorage.setItem("registeredUsers", JSON.stringify(users));
  return true;
};

const findUser = (email: string, password: string, role: string): StoredUser | null => {
  const users = getRegisteredUsers();
  return users.find(u => u.email === email && u.password === password && u.role === role) || null;
};

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    location: "",
  });

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsLogin(true);
    setFormData({ email: "", password: "", name: "", phone: "", location: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const user = findUser(formData.email, formData.password, selectedRole!);
        if (!user) {
          toast({
            title: t('auth.login_failed'),
            description: t('auth.invalid_credentials'),
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        localStorage.setItem("currentUser", JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
        }));
        toast({
          title: t('auth.login_success'),
          description: `${t('auth.logged_in_as')} ${user.name}`,
        });
        const routes: Record<string, string> = {
          farmer: "/farmer/dashboard",
          merchant: "/merchant/dashboard",
          expert: "/expert/dashboard",
          admin: "/admin/dashboard",
        };
        window.location.href = routes[user.role] || "/farmer/dashboard";
      } else {
        if (formData.password.length < 6) {
          toast({
            title: t('auth.weak_password'),
            description: t('auth.password_min'),
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        const newUser: StoredUser = {
          email: formData.email,
          password: formData.password,
          name: formData.name || formData.email.split("@")[0],
          role: selectedRole!,
          phone: formData.phone,
          location: formData.location,
        };
        const saved = saveRegisteredUser(newUser);
        if (!saved) {
          toast({
            title: t('auth.user_exists'),
            description: t('auth.already_registered'),
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        toast({
          title: t('auth.signup_success'),
          description: t('auth.now_login'),
        });
        setIsLogin(true);
        setFormData({ ...formData, name: "", phone: "", location: "" });
      }
      setLoading(false);
    }, 600);
  };

  const roleCards = [
    {
      role: "farmer",
      title: t("auth.signin_farmer"),
      image: farmerImg,
      description: t("auth.farmer_desc"),
    },
    {
      role: "merchant",
      title: t("auth.signin_merchant"),
      image: merchantImg,
      description: t("auth.merchant_desc"),
    },
    {
      role: "expert",
      title: t("auth.signin_expert"),
      image: expertImg,
      description: t("auth.expert_desc"),
    },
    {
      role: "admin",
      title: t("auth.signin_admin"),
      image: adminImg,
      description: t("auth.admin_desc"),
    },
  ];

  // ROLE SELECTION SCREEN
  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background">
        <div className="tricolor-bar h-1.5" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-6">
            <LanguageSelector />
          </div>

          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <AshokaChakra size={44} />
            </div>
            <h1 className="text-3xl font-bold text-gradient-tricolor mb-2">
              Smart Crop Advisory
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("auth.welcome")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roleCards.map((card) => (
              <Card
                key={card.role}
                className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => handleRoleSelect(card.role)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow-lg">
                    {card.title}
                  </h3>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {card.description}
                  </p>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    {t("common.continue")} →
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

  // LOGIN/SIGNUP FORM
  const currentRole = roleCards.find((r) => r.role === selectedRole);

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-5">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" onClick={() => setSelectedRole(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("common.back")}
            </Button>
            <LanguageSelector />
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <AshokaChakra size={32} />
            <h1 className="text-xl font-bold text-gradient-tricolor">Smart Crop Advisory</h1>
          </div>

          <Card className="tricolor-card">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img src={currentRole?.image} alt={currentRole?.title} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
                <span className="font-semibold text-foreground">{currentRole?.title}</span>
              </div>
              <CardTitle className="text-xl">
                {isLogin ? t("auth.signin") : t("auth.signup")}
              </CardTitle>
              <CardDescription>
                {isLogin ? t("auth.signin_desc") : t("auth.signup_desc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="name">{t("auth.fullname")}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="name" placeholder={t("auth.enter_name")} className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">{t("auth.phone")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder={t("auth.enter_phone")} className="pl-10" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="location">{t("auth.location")}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="location" placeholder={t("auth.enter_location")} className="pl-10" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("auth.email")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder={t("auth.enter_email")} className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    {isLogin && (
                      <button type="button" className="text-xs text-primary hover:underline">
                        {t("auth.forgot_password")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("auth.enter_password")} className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t("common.loading")}
                    </span>
                  ) : isLogin ? t("auth.signin") : t("auth.signup")}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-5">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  {t("auth.or_continue_with")}
                </span>
              </div>

              {/* Social sign-in options */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="gap-2" onClick={() => toast({ title: "Google Sign In", description: "Coming soon!" })}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="gap-2" onClick={() => toast({ title: "Phone Sign In", description: "Coming soon!" })}>
                  <Smartphone className="h-4 w-4" />
                  {t("auth.phone")}
                </Button>
              </div>

              {/* Toggle sign in / sign up */}
              <div className="mt-5 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                  {isLogin ? t("auth.no_account") : t("auth.have_account")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Side */}
      <div className="hidden lg:block relative">
        <img src={heroImage} alt="Smart farming technology" className="absolute inset-0 w-full h-full object-cover" />
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
