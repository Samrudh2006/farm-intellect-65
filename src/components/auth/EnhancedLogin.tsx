import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Phone, Eye, EyeOff, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PasswordValidation } from "./PasswordValidation";
import { OTPVerification } from "./OTPVerification";

interface EnhancedLoginProps {
  onLogin: (userData: any) => void;
}

export const EnhancedLogin = ({ onLogin }: EnhancedLoginProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("aadhaar");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  
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

  const sendOTP = async () => {
    const identifier = activeTab === "aadhaar" ? formData.aadhaar : formData.phone;
    
    if (activeTab === "aadhaar" && !validateAadhaar(identifier)) {
      toast({
        title: "Invalid Aadhaar",
        description: "Please enter a valid 12-digit Aadhaar number",
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
      description: `OTP sent to your ${activeTab === "aadhaar" ? "registered mobile" : "phone number"}`,
    });
    
    setShowOTP(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation for signup
    if (!isLogin && !validatePassword(formData.password)) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters with 1 uppercase, 1 lowercase, and 1 number",
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

    // Mock login/signup (in production, call backend API)
    const userData = {
      id: Date.now().toString(),
      username: formData.username || "Farmer",
      aadhaar: formData.aadhaar,
      farmerId: formData.farmerId,
      phone: formData.phone,
      role: formData.role || 'farmer',
      isFirstLogin: !isLogin
    };

    // Save to localStorage (temporary solution)
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    toast({
      title: isLogin ? "Login Successful" : "Account Created",
      description: isLogin ? "Welcome back!" : "Your account has been created successfully",
    });

    onLogin(userData);
  };

  const handleGoogleLogin = () => {
    // Mock Google OAuth (in production, integrate with Google OAuth)
    const userData = {
      id: Date.now().toString(),
      username: "Google User",
      role: 'farmer',
      loginMethod: 'google',
      isFirstLogin: false
    };

    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    toast({
      title: "Google Login Successful",
      description: "Welcome! You're logged in with Google",
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
            <div className="text-center space-y-4">
              <p>OTP sent to {activeTab === "aadhaar" ? "registered mobile" : formData.phone}</p>
              <Input
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={(e) => handleInputChange('otp', e.target.value)}
                maxLength={6}
              />
              <div className="flex gap-2">
                <Button onClick={() => {
                  if (formData.otp === "123456") {
                    const userData = { username: formData.username || "Farmer", role: formData.role || "farmer" };
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    onLogin(userData);
                  }
                }} className="flex-1">Verify OTP</Button>
                <Button variant="outline" onClick={() => setShowOTP(false)}>Back</Button>
              </div>
            </div>
          ) : (
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
                
                <TabsContent value="aadhaar" className="space-y-4">
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
                      required
                    />
                    {formData.aadhaar && !validateAadhaar(formData.aadhaar) && (
                      <p className="text-sm text-red-500">Please enter a valid 12-digit Aadhaar number</p>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="farmerId" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmerId">Farmer ID</Label>
                    <Input
                      id="farmerId"
                      type="text"
                      value={formData.farmerId}
                      onChange={(e) => handleInputChange('farmerId', e.target.value)}
                      placeholder="Enter your Farmer ID"
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Your Name</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              {!isLogin && (
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
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Min 6 chars, 1 upper, 1 lower, 1 number"
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
                {formData.password && !validatePassword(formData.password) && (
                  <p className="text-sm text-red-500">
                    Password must have 6+ characters, 1 uppercase, 1 lowercase, 1 number
                  </p>
                )}
              </div>

              {!isLogin && (
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
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
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