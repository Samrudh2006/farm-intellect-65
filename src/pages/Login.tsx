import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { useToast } from "@/hooks/use-toast";
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
  // Check if email+role combo already exists
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
        // LOGIN: validate credentials for the selected role
        const user = findUser(formData.email, formData.password, selectedRole!);
        if (!user) {
          toast({
            title: t('auth.login_failed') || "Login Failed",
            description: t('auth.invalid_credentials') || "Invalid email or password for this role. Please sign up first.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        // Success
        localStorage.setItem("currentUser", JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
        }));
        toast({
          title: t('auth.login_success') || "Welcome back!",
          description: `${t('auth.logged_in_as') || "Logged in as"} ${user.name}`,
        });
        const routes: Record<string, string> = {
          farmer: "/farmer/dashboard",
          merchant: "/merchant/dashboard",
          expert: "/expert/dashboard",
          admin: "/admin/dashboard",
        };
        window.location.href = routes[user.role] || "/farmer/dashboard";
      } else {
        // SIGNUP: register new user for the selected role
        if (formData.password.length < 6) {
          toast({
            title: t('auth.weak_password') || "Weak Password",
            description: t('auth.password_min') || "Password must be at least 6 characters.",
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
            title: t('auth.user_exists') || "User Exists",
            description: t('auth.already_registered') || "This email is already registered for this role. Please sign in.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        toast({
          title: t('auth.signup_success') || "Account Created!",
          description: t('auth.now_login') || "You can now sign in with your credentials.",
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
      title: t("auth.signin_farmer") || "Farmer",
      image: farmerImg,
      description: t("auth.farmer_desc") || "Manage crops, get AI recommendations, connect with merchants",
    },
    {
      role: "merchant",
      title: t("auth.signin_merchant") || "Merchant",
      image: merchantImg,
      description: t("auth.merchant_desc") || "Connect with farmers, manage purchases, set crop prices",
    },
    {
      role: "expert",
      title: t("auth.signin_expert") || "Expert",
      image: expertImg,
      description: t("auth.expert_desc") || "Provide advisory services, share agricultural expertise",
    },
    {
      role: "admin",
      title: t("auth.signin_admin") || "Admin",
      image: adminImg,
      description: t("auth.admin_desc") || "Manage system, oversee all operations and users",
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
              {t("auth.welcome") || "Select your role to continue"}
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
                    {t("common.continue") || "Continue"} →
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
          <Button variant="ghost" onClick={() => setSelectedRole(null)} className="mb-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("common.back") || "Back to role selection"}
          </Button>

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
                {isLogin ? (t("auth.signin") || "Sign In") : (t("auth.signup") || "Sign Up")}
              </CardTitle>
              <CardDescription>
                {isLogin
                  ? (t("auth.signin_desc") || "Enter your credentials to access your dashboard")
                  : (t("auth.signup_desc") || "Create a new account to get started")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="name">{t("auth.fullname") || "Full Name"}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="name" placeholder={t("auth.enter_name") || "Enter your full name"} className="pl-10" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">{t("auth.phone") || "Phone"}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" type="tel" placeholder={t("auth.enter_phone") || "Enter phone number"} className="pl-10" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="location">{t("auth.location") || "Location"}</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="location" placeholder={t("auth.enter_location") || "Enter your location"} className="pl-10" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">{t("auth.email") || "Email"}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder={t("auth.enter_email") || "Enter your email"} className="pl-10" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">{t("auth.password") || "Password"}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder={t("auth.enter_password") || "Enter your password"} className="pl-10 pr-10" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t("common.loading") || "Please wait..."}
                    </span>
                  ) : isLogin ? (t("auth.signin") || "Sign In") : (t("auth.signup") || "Sign Up")}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                  {isLogin
                    ? (t("auth.no_account") || "Don't have an account? Sign up")
                    : (t("auth.have_account") || "Already have an account? Sign in")}
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
