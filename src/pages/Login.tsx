import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/language-selector";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { FirebaseAuth } from "@/integrations/firebase/client";
import heroImage from "@/assets/hero-farming.jpg";
import farmerImg from "@/assets/roles/farmer-role.jpg";
import merchantImg from "@/assets/roles/merchant-role.jpg";
import expertImg from "@/assets/roles/expert-role.jpg";
import adminImg from "@/assets/roles/admin-role.jpg";

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [phoneMethod, setPhoneMethod] = useState<"sms" | "whatsapp">("sms");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    name: "",
    location: "",
    aadhaar: "",
  });
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsLogin(true);
    setAuthMethod("email");
    setOtpSent(false);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      name: "",
      location: "",
      aadhaar: "",
    });
    setOtp(["", "", "", "", "", ""]);
    setConfirmationResult(null);
  };

  // Email Authentication
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(formData.email, formData.password);
      if (error) throw error;
      
      const userData = {
        email: formData.email,
        role: selectedRole,
        displayName: formData.email,
      };
      
      localStorage.setItem("farmer_user", JSON.stringify(userData));
      
      const routes: Record<string, string> = {
        farmer: "/farmer/dashboard",
        merchant: "/merchant/dashboard",
        expert: "/expert/dashboard",
        admin: "/admin/dashboard",
      };
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate(routes[selectedRole || "farmer"] || "/farmer/dashboard");
    } catch (error: any) {
      console.error("[v0] Email Login Error:", error);
      let errorMessage = "Login failed";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email first";
      } else {
        errorMessage = error.message || "Login failed. Please try again.";
      }
      
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        display_name: formData.name || formData.email,
        role: selectedRole || "farmer",
        phone: formData.phone,
        location: formData.location,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Account created! Please sign in with your credentials.",
      });
      setIsLogin(true);
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
        name: "",
        location: "",
        phone: "",
      });
    } catch (error: any) {
      console.error("[v0] Email Signup Error:", error);
      let errorMessage = "Signup failed";
      
      if (error.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please sign in.";
      } else if (error.message?.includes("invalid email")) {
        errorMessage = "Please enter a valid email address";
      } else {
        errorMessage = error.message || "Signup failed. Please try again.";
      }
      
      toast({
        title: "Signup Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP Authentication
  const sendOTP = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      toast({
        title: t("auth.invalid_phone"),
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = `+91${formData.phone}`;
    setLoading(true);

    try {
      await FirebaseAuth.sendOTP(phoneNumber, "recaptcha-container");
      setOtpSent(true);
      setResendTimer(30);
      toast({
        title: t("auth.otp_sent"),
        description: phoneMethod === "whatsapp" ? "OTP sent via WhatsApp" : "OTP sent via SMS",
      });
    } catch (error: any) {
      console.error("[v0] OTP Error:", error);
      let errorMessage = "Failed to send OTP";

      if (error.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.code === "auth/quota-exceeded") {
        errorMessage = "SMS quota exceeded. Please try again later.";
      }

      toast({
        title: t("auth.error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast({
        title: t("auth.enter_otp"),
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const user = await FirebaseAuth.verifyOTP(otpCode);

      if (user) {
        const userData = {
          uid: user.uid,
          phone: user.phoneNumber,
          role: selectedRole,
          displayName: formData.name || user.phoneNumber,
          aadhaar: formData.aadhaar,
          location: formData.location,
        };

        localStorage.setItem("farmer_user", JSON.stringify(userData));

        const routes: Record<string, string> = {
          farmer: "/farmer/dashboard",
          merchant: "/merchant/dashboard",
          expert: "/expert/dashboard",
          admin: "/admin/dashboard",
        };

        toast({
          title: t("auth.login_success"),
          description: t("auth.welcome_back"),
        });
        navigate(routes[selectedRole || "farmer"] || "/farmer/dashboard");
      }
    } catch (error: any) {
      console.error("[v0] OTP Verification Error:", error);
      let errorMessage = "Invalid OTP";

      if (error.code === "auth/invalid-verification-code") {
        errorMessage = "Invalid OTP code. Please try again.";
      } else if (error.code === "auth/code-expired") {
        errorMessage = "OTP has expired. Please request a new one.";
      }

      toast({
        title: t("auth.error"),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone || formData.phone.length < 10) {
      toast({
        title: t("auth.invalid_phone"),
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && (!formData.name || !formData.location)) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    await sendOTP();
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 6 - index).split("");
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value.replace(/\D/g, "");
      setOtp(newOtp);
      if (value && index < 5) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOTPKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && otp.join("").length === 6 && otpSent) {
        verifyOTP();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [otp, otpSent]);

  const roleCards = [
    { role: "farmer", title: t("auth.signin_farmer"), image: farmerImg, description: t("auth.farmer_desc") },
    { role: "merchant", title: t("auth.signin_merchant"), image: merchantImg, description: t("auth.merchant_desc") },
    { role: "expert", title: t("auth.signin_expert"), image: expertImg, description: t("auth.expert_desc") },
    { role: "admin", title: t("auth.signin_admin"), image: adminImg, description: t("auth.admin_desc") },
  ];

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-background">
        <div className="tricolor-bar h-1.5" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const isDark = document.documentElement.classList.toggle("dark");
                localStorage.setItem("theme", isDark ? "dark" : "light");
              }}
              aria-label="Toggle dark mode"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <LanguageSelector />
          </div>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <AshokaChakra size={44} />
            </div>
            <h1 className="text-3xl font-bold text-gradient-tricolor mb-2">Smart Crop Advisory</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("auth.welcome")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {roleCards.map((card) => (
              <Card key={card.role} className="group cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1" onClick={() => handleRoleSelect(card.role)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 text-white font-bold text-lg drop-shadow-lg">{card.title}</h3>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{card.description}</p>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">{t("common.continue")} →</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div className="tricolor-bar h-1.5 mt-12" />
      </div>
    );
  }

  const currentRole = roleCards.find((r) => r.role === selectedRole);

  if (otpSent) {
    return (
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="flex items-center justify-center p-6 bg-background">
          <div className="w-full max-w-md space-y-5">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" onClick={() => { setOtpSent(false); setOtp(["", "", "", "", "", ""]); }} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> {t("common.back")}
              </Button>
              <LanguageSelector />
            </div>
            <Card className="tricolor-card overflow-hidden">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Verify OTP</CardTitle>
                <CardDescription>Enter the 6-digit code sent to +91 {formData.phone}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => { otpRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-bold"
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    />
                  ))}
                </div>
                <Button
                  onClick={verifyOTP}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("common.loading")}
                    </span>
                  ) : "Verify & Login"}
                </Button>
                <div className="mt-4 text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">Resend OTP in {resendTimer}s</p>
                  ) : (
                    <button onClick={sendOTP} className="text-sm text-primary hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="hidden lg:block relative">
          <img src={currentRole?.image} alt={currentRole?.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-5">
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" onClick={() => setSelectedRole(null)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {t("common.back")}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const isDark = document.documentElement.classList.toggle("dark");
                  localStorage.setItem("theme", isDark ? "dark" : "light");
                }}
                aria-label="Toggle dark mode"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <LanguageSelector />
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <AshokaChakra size={32} />
            <h1 className="text-xl font-bold text-gradient-tricolor">Smart Crop Advisory</h1>
          </div>
          <Card className="tricolor-card overflow-hidden">
            <div className="relative h-40 overflow-hidden">
              <img src={currentRole?.image} alt={currentRole?.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <h3 className="absolute bottom-3 left-4 text-white font-bold text-xl drop-shadow-lg">{currentRole?.title}</h3>
            </div>
            <CardHeader className="text-center pb-4 pt-4">
              <CardTitle className="text-xl">{isLogin ? t("auth.signin") : t("auth.signup")}</CardTitle>
              <CardDescription>{isLogin ? t("auth.signin_desc") : t("auth.signup_desc")}</CardDescription>
              {/* Auth Method Tabs */}
              <div className="flex gap-2 mt-4 bg-muted p-1 rounded-lg">
                <Button
                  type="button"
                  variant={authMethod === "email" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setAuthMethod("email"); setOtpSent(false); }}
                  className="flex-1"
                >
                  📧 Email
                </Button>
                <Button
                  type="button"
                  variant={authMethod === "phone" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => { setAuthMethod("phone"); setOtpSent(false); }}
                  className="flex-1"
                >
                  📱 Phone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {authMethod === "email" ? (
                // Email Authentication Form
                <form onSubmit={isLogin ? handleEmailLogin : handleEmailSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          Location
                        </Label>
                        <Input
                          id="location"
                          placeholder="Your village/city"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 1C6.48 1 2 5.48 2 11v8c0 1.1.9 2 2 2h4v-8H3v-3c0-4.42 3.58-8 8-8s8 3.58 8 8v3h-7v8h11c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10zm0 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1C6.48 1 2 5.48 2 11v8c0 1.1.9 2 2 2h4v-8H3v-3c0-4.42 3.58-8 8-8s8 3.58 8 8v3h-7v8h11c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10zm0 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t("common.loading")}
                      </span>
                    ) : isLogin ? "Sign In" : "Create Account"}
                  </Button>
                </form>
              ) : (
                // Phone OTP Form
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  {!isLogin && (
                    <>
                      <div className="space-y-1.5">
                        <Label htmlFor="name-phone" className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          {t("auth.fullname")}
                        </Label>
                        <Input id="name-phone" placeholder={t("auth.enter_name")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="location-phone" className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {t("auth.location")}
                        </Label>
                        <Input id="location-phone" placeholder="Your village/city" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                      </div>
                    </>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone-phone" className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
                        <path d="M12.5 8.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                        <path d="M8.5 7h-1c-.28 0-.5.22-.5.5v7c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-7c0-.28-.22-.5-.5-.5zm7 0h-1c-.28 0-.5.22-.5.5v7c0 .28.22.5.5.5h1c.28 0 .5-.22.5-.5v-7c0-.28-.22-.5-.5-.5z"/>
                      </svg>
                      {t("auth.phone")}
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">+91</span>
                      <Input 
                        id="phone-phone"
                        type="tel"
                        placeholder="9876543210"
                        className="rounded-l-none"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {t("common.loading")}
                      </span>
                    ) : "Send OTP"}
                  </Button>
                </form>
              )}

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>

              <div className="mt-5 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                  {isLogin ? t("auth.no_account") : t("auth.have_account")}
                </button>
              </div>
            </CardContent>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t("auth.or_continue_with")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" type="button" className="h-14 py-0" onClick={() => { setPhoneMethod("sms"); sendOTP(); }}>
                  <svg className="h-7 w-7 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
                  </svg>
                  <span className="ml-2">SMS OTP</span>
                </Button>
                <Button variant="outline" type="button" className="h-14 py-0" onClick={() => { setPhoneMethod("whatsapp"); sendOTP(); }}>
                  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span className="ml-2">WhatsApp</span>
                </Button>
              </div>

              <div className="mt-5 text-center">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
                  {isLogin ? t("auth.no_account") : t("auth.have_account")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:block relative">
        <img src={currentRole?.image} alt={currentRole?.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-3 mb-3">
            <AshokaChakra size={32} animate={false} className="drop-shadow-lg [&_circle]:fill-white [&_line]:stroke-white" />
            <h2 className="text-3xl font-bold text-white">{currentRole?.title}</h2>
          </div>
          <p className="text-lg text-white/90">{currentRole?.description}</p>
          <div className="tricolor-bar h-1 mt-4 rounded-full" />
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
