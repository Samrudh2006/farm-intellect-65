import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Eye, EyeOff, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PasswordValidation } from "./PasswordValidation";
import { OTPVerification } from "./OTPVerification";

interface EnhancedLoginProps {
  onLogin: (userData: any) => void;
}

export const EnhancedLogin = ({ onLogin }: EnhancedLoginProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("email");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    otp: ""
  });
  
  const [errors, setErrors] = useState({
    password: "",
    general: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone);
  };

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSpaces: !/\s/.test(password)
    };
    
    const isValid = Object.values(requirements).every(Boolean);
    
    if (!isValid && password.length > 0) {
      setErrors(prev => ({
        ...prev,
        password: "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        password: ""
      }));
    }
    
    return isValid;
  };

  const sendOTP = async () => {
    const identifier = activeTab === "email" ? formData.email : formData.phone;
    
    if (activeTab === "email" && !validateEmail(identifier)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (activeTab === "phone" && !validatePhone(identifier)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    // Mock OTP sending (in production, call backend API)
    console.log(`Sending OTP to ${identifier}`);
    
    toast({
      title: "OTP Sent",
      description: `OTP sent to your ${activeTab === "email" ? "email" : "phone number"}`,
    });
    
    setShowOTP(true);
  };

  const handlePasswordChange = (value: string) => {
    handleInputChange('password', value);
    validatePassword(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ password: "", general: "" });
    
    // Validate password for both login and signup
    if (!validatePassword(formData.password)) {
      return;
    }
    
    if (!isLogin && !isValidPassword) {
      setErrors(prev => ({
        ...prev,
        general: "Please ensure your password meets all requirements"
      }));
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        general: "Passwords don't match"
      }));
      return;
    }

    if (!isLogin && !formData.role) {
      setErrors(prev => ({
        ...prev,
        general: "Please select your role"
      }));
      return;
    }

    if (!isLogin && !formData.username.trim()) {
      setErrors(prev => ({
        ...prev,
        general: "Username is required"
      }));
      return;
    }

    // Mock authentication
    if (isLogin) {
      // Mock login validation - in production, check against backend
      if (formData.password.length < 8) {
        setErrors(prev => ({
          ...prev,
          general: "Invalid credentials"
        }));
        return;
      }
    }

    const userData = {
      id: Date.now().toString(),
      email: formData.email,
      phone: formData.phone,
      username: formData.username || `user_${Date.now()}`,
      role: formData.role || 'farmer',
      isFirstLogin: !isLogin
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    toast({
      title: isLogin ? "Login Successful" : "Account Created",
      description: isLogin ? "Welcome back!" : "Your account has been created successfully",
    });

    onLogin(userData);
  };

  const handleGoogleLogin = () => {
    // Mock Google OAuth - in production, integrate with actual Google OAuth
    const userData = {
      id: Date.now().toString(),
      email: "user@gmail.com",
      username: "Google User",
      role: 'farmer',
      isFirstLogin: true
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    toast({
      title: "Google Login Successful",
      description: "Welcome! You've been signed in with Google",
    });

    onLogin(userData);
  };

  const handleOTPLogin = (userData: any) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    toast({
      title: "OTP Verification Successful",
      description: "Welcome! You've been signed in",
    });

    onLogin(userData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {showOTP ? (
            <OTPVerification
              type={activeTab === "email" ? "email" : "sms"}
              contact={activeTab === "email" ? formData.email : formData.phone}
              purpose="login"
              userId="temp"
              onVerified={() => {
                const userData = {
                  id: Date.now().toString(),
                  email: formData.email,
                  phone: formData.phone,
                  username: formData.username || `user_${Date.now()}`,
                  role: formData.role || 'farmer',
                  isFirstLogin: true
                };
                handleOTPLogin(userData);
              }}
              onCancel={() => setShowOTP(false)}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="phone" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Enter your username"
                        className="pl-10"
                        required
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Farmer</SelectItem>
                        <SelectItem value="merchant">Merchant</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <PasswordValidation 
                    password={formData.password} 
                    onValidationChange={setIsValidPassword}
                  />
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </>
              )}

              {errors.general && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">{errors.general}</p>
                </div>
              )}

              <div className="space-y-3">
                <Button type="submit" className="w-full">
                  {isLogin ? "Sign In" : "Create Account"}
                </Button>
                
                <Button type="button" onClick={sendOTP} variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Sign in with OTP
                </Button>
                
                <Button type="button" onClick={handleGoogleLogin} variant="outline" className="w-full">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};