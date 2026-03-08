import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Phone, Eye, EyeOff, Shield, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

interface LoginUserData {
  id: string;
  username: string;
  farmerId?: string;
  role: string;
  isFirstLogin: boolean;
  loginMethod?: string;
}

interface EnhancedLoginProps {
  onLogin: (userData: LoginUserData) => void;
}

export const EnhancedLogin = ({ onLogin }: EnhancedLoginProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("aadhaar");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [formData, setFormData] = useState({
    aadhaar: "",
    farmerId: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    otp: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateAadhaar = (aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return minLength && hasUpper && hasLower && hasNumber;
  };

  const validatePhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  // Google OAuth Sign In using Lovable Cloud managed auth
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      
      if (result.error) {
        throw result.error;
      }
      
      // If redirected, the page will navigate away
      if (!result.redirected) {
        // Session is set, check for user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const userData = {
            id: user.id,
            username: user.user_metadata?.full_name || user.email?.split('@')[0] || "Google User",
            role: 'farmer',
            loginMethod: 'google',
            isFirstLogin: false
          };
          
          toast({
            title: t('auth.login_success'),
            description: t('auth.google_signin'),
          });
          
          onLogin(userData);
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        title: t('auth.login_failed'),
        description: error.message || "Failed to sign in with Google",
        variant: "destructive"
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Phone OTP Sign In
  const sendOTP = async () => {
    if (!validatePhone(formData.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsOtpLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: `+91${formData.phone}`,
      });

      if (error) throw error;

      setOtpSent(true);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error("OTP send error:", error);
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsOtpLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: `+91${formData.phone}`,
        token: formData.otp,
        type: 'sms'
      });

      if (error) throw error;

      if (data.user) {
        const userData = {
          id: data.user.id,
          username: data.user.phone || "Phone User",
          role: formData.role || 'farmer',
          loginMethod: 'phone',
          isFirstLogin: true
        };

        toast({
          title: t('auth.login_success'),
          description: t('auth.phone_signin'),
        });

        onLogin(userData);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Password validation for signup
      if (!isLogin && !validatePassword(formData.password)) {
        toast({
          title: t('auth.weak_password'),
          description: t('auth.password_min'),
          variant: "destructive"
        });
        return;
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please ensure both passwords match",
          variant: "destructive"
        });
        return;
      }

      if (!isLogin && !formData.role) {
        toast({
          title: "Role Required",
          description: "Please select your role",
          variant: "destructive"
        });
        return;
      }

      if (!isLogin && !formData.username.trim()) {
        toast({
          title: "Username Required",
          description: "Please enter your name",
          variant: "destructive"
        });
        return;
      }

      // Validate identification
      const identifier = activeTab === "aadhaar" ? formData.aadhaar : formData.farmerId;
      if (!identifier) {
        toast({
          title: "ID Required",
          description: `Please enter your ${activeTab === "aadhaar" ? "Aadhaar number" : "Farmer ID"}`,
          variant: "destructive"
        });
        return;
      }

      // Create email from identifier for Supabase auth
      const email = `${identifier}@farmapp.local`;

      if (isLogin) {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          const userData = {
            id: data.user.id,
            username: data.user.user_metadata?.display_name || formData.username || "Farmer",
            farmerId: formData.farmerId,
            role: data.user.user_metadata?.role || 'farmer',
            isFirstLogin: false
          };

          toast({
            title: t('auth.login_success'),
          });

          onLogin(userData);
        }
      } else {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password: formData.password,
          options: {
            data: {
              display_name: formData.username,
              role: formData.role,
              phone: formData.phone,
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          const userData = {
            id: data.user.id,
            username: formData.username,
            farmerId: formData.farmerId,
            role: formData.role || 'farmer',
            isFirstLogin: true
          };

          toast({
            title: t('auth.signup_success'),
            description: t('auth.now_login'),
          });

          onLogin(userData);
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: isLogin ? t('auth.login_failed') : "Signup Failed",
        description: error.message || t('auth.invalid_credentials'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md tricolor-card animate-fade-in">
        <CardHeader className="space-y-1">
          <div className="tricolor-bar h-1 w-full rounded-full mb-4" />
          <CardTitle className="text-center text-2xl font-bold">
            {isLogin ? t('auth.login_success').replace('!', '') : t('auth.signup')}
          </CardTitle>
          <p className="text-center text-muted-foreground text-sm">
            {isLogin ? t('auth.signin_desc') : t('auth.signup_desc')}
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="aadhaar" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Aadhaar
                </TabsTrigger>
                <TabsTrigger value="farmerId" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Farmer ID
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="aadhaar" className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    value={formData.aadhaar}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                      handleInputChange('aadhaar', value);
                    }}
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength={12}
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                  {formData.aadhaar && !validateAadhaar(formData.aadhaar) && (
                    <p className="text-sm text-destructive">Please enter a valid 12-digit Aadhaar number</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="farmerId" className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer ID</Label>
                  <Input
                    id="farmerId"
                    type="text"
                    value={formData.farmerId}
                    onChange={(e) => handleInputChange('farmerId', e.target.value)}
                    placeholder="Enter your Farmer ID"
                    className="transition-all focus:ring-2 focus:ring-primary"
                  />
                </div>
              </TabsContent>
            </Tabs>

            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="username">{t('auth.fullname')}</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder={t('auth.enter_name')}
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <div className="flex gap-2">
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder={t('auth.enter_phone')}
                  className="flex-1 transition-all focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-2 animate-slide-up">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    value={formData.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="flex-1"
                  />
                  <Button type="button" onClick={verifyOTP} disabled={isOtpLoading}>
                    {isOtpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="role">{t('auth.role')}</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">{t('auth.signin_farmer').replace('Sign in as ', '')}</SelectItem>
                    <SelectItem value="merchant">{t('auth.signin_merchant').replace('Sign in as ', '')}</SelectItem>
                    <SelectItem value="expert">{t('auth.signin_expert').replace('Sign in as ', '')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('auth.enter_password')}
                  className="pr-10 transition-all focus:ring-2 focus:ring-primary"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && !validatePassword(formData.password) && (
                <p className="text-sm text-destructive">
                  {t('auth.password_min')}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="transition-all focus:ring-2 focus:ring-primary"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-destructive">Passwords do not match</p>
                )}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {isLogin ? t('auth.signin') : t('auth.signup')}
              </Button>
              
              <Button 
                type="button" 
                onClick={sendOTP} 
                variant="outline" 
                className="w-full hover:bg-accent/10 transition-all"
                disabled={isOtpLoading || !formData.phone}
              >
                {isOtpLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Phone className="h-4 w-4 mr-2" />
                )}
                {t('auth.phone_signin')}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {t('auth.or_continue_with')}
                  </span>
                </div>
              </div>
              
              <Button 
                type="button" 
                onClick={handleGoogleLogin} 
                variant="outline" 
                className="w-full hover:bg-accent/10 transition-all"
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {t('auth.google_signin')}
              </Button>
            </div>

            <div className="text-center pt-2">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80"
              >
                {isLogin ? t('auth.no_account') : t('auth.have_account')}
              </Button>
            </div>
            
            <p className="text-xs text-center text-muted-foreground">
              {t('auth.terms')}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
