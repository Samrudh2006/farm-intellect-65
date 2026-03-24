import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, ShoppingBag, Award, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { PinAuth } from "@/services/pinAuth";

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<"role" | "form">("role");
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: "",
    pin: "",
    aadhaar: "",
    name: "",
  });

  const roles = [
    { id: "farmer", label: "Farmer", icon: Sprout },
    { id: "merchant", label: "Merchant", icon: ShoppingBag },
    { id: "expert", label: "Expert", icon: Award },
    { id: "admin", label: "Admin", icon: Settings },
  ];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setCurrentStep("form");
  };

  const handleBackToRoles = () => {
    setCurrentStep("role");
    setSelectedRole(null);
    setIsSignup(false);
    setFormData({ phone: "", pin: "", aadhaar: "", name: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    if (!formData.phone || !formData.pin || !formData.aadhaar) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (formData.phone.length !== 10) {
      toast({ title: "Error", description: "Phone must be 10 digits", variant: "destructive" });
      return;
    }

    if (formData.pin.length !== 6) {
      toast({ title: "Error", description: "PIN must be 6 digits", variant: "destructive" });
      return;
    }

    if (formData.aadhaar.length !== 12) {
      toast({ title: "Error", description: "Aadhaar must be 12 digits", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await PinAuth.signup(
        "+91" + formData.phone,
        formData.pin,
        formData.aadhaar,
        formData.name,
        selectedRole?.toUpperCase() || "FARMER"
      );

      if (result.success && result.user) {
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("farmer_user", JSON.stringify({
          id: result.user.id,
          phone: result.user.phone,
          role: selectedRole?.toLowerCase(),
          name: result.user.name,
        }));

        toast({ title: "Success", description: "Account created successfully" });
        navigate(`/${selectedRole}/dashboard`);
      } else {
        toast({ title: "Error", description: result.error || "Signup failed", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Signup failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!formData.phone || !formData.pin || !formData.aadhaar) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (formData.phone.length !== 10) {
      toast({ title: "Error", description: "Phone must be 10 digits", variant: "destructive" });
      return;
    }

    if (formData.pin.length !== 6) {
      toast({ title: "Error", description: "PIN must be 6 digits", variant: "destructive" });
      return;
    }

    if (formData.aadhaar.length !== 12) {
      toast({ title: "Error", description: "Aadhaar must be 12 digits", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const result = await PinAuth.signin(
        "+91" + formData.phone,
        formData.pin,
        formData.aadhaar
      );

      if (result.success && result.user) {
        localStorage.setItem("auth_token", result.token);
        localStorage.setItem("farmer_user", JSON.stringify({
          id: result.user.id,
          phone: result.user.phone,
          role: result.user.role.toLowerCase(),
          name: result.user.name,
        }));

        toast({ title: "Success", description: "Login successful" });
        navigate(`/${result.user.role.toLowerCase()}/dashboard`);
      } else {
        toast({ title: "Error", description: result.error || "Login failed", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Login failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (currentStep === "role") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Hero Section */}
            <div className="hidden lg:flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-5xl font-bold text-green-700 mb-2">Smart Crop Advisory</h1>
                <p className="text-xl text-gray-600">Advanced AI-powered agricultural solutions</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Crop Analysis</h3>
                    <p className="text-sm text-gray-600">AI-powered crop disease detection and recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Expert Guidance</h3>
                    <p className="text-sm text-gray-600">Connect with agricultural experts for personalized advice</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Market Access</h3>
                    <p className="text-sm text-gray-600">Direct access to buyers and fair pricing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Role Selection */}
            <div>
              <Card className="border-none shadow-xl">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-3xl font-bold text-green-700">Smart Crop Advisory</CardTitle>
                  <CardDescription className="text-base mt-2">Select Your Role to Continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {roles.map(role => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          className="group cursor-pointer transition-transform hover:scale-105"
                        >
                          <Card className="h-full hover:shadow-lg transition-shadow hover:border-green-200">
                            <CardContent className="p-6 flex flex-col items-center text-center">
                              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Icon className="w-8 h-8 text-green-600" />
                              </div>
                              <h3 className="font-bold text-lg text-gray-800">{role.label}</h3>
                              <p className="text-xs text-gray-500 mt-1">Select to continue</p>
                            </CardContent>
                          </Card>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentRole = roles.find(r => r.id === selectedRole);
  const RoleIcon = currentRole?.icon || Sprout;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-xl">
          <CardHeader className="relative pb-4">
            <button
              onClick={handleBackToRoles}
              className="absolute top-4 left-4 text-green-600 hover:text-green-700 flex items-center gap-2 transition-colors"
            >
              ← Back
            </button>
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                  <RoleIcon className="w-7 h-7 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800">{isSignup ? "Create Account" : "Login"}</CardTitle>
              <CardDescription className="mt-1">{currentRole?.label}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            {isSignup && (
              <>
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-2 border-gray-300 focus:border-green-500"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number</Label>
              <div className="flex gap-2 mt-2">
                <span className="flex items-center px-3 bg-gray-100 rounded-lg text-gray-600 font-semibold border border-gray-300">
                  +91
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="10 digits"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="border-gray-300 focus:border-green-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter your 10-digit mobile number</p>
            </div>

            <div>
              <Label htmlFor="pin" className="text-gray-700 font-semibold">Personal PIN</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                placeholder="6 digits"
                maxLength="6"
                value={formData.pin}
                onChange={handleInputChange}
                disabled={loading}
                className="mt-2 border-gray-300 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">{isSignup ? "Create your unique 6-digit PIN" : "Enter your 6-digit PIN"}</p>
            </div>

            <div>
              <Label htmlFor="aadhaar" className="text-gray-700 font-semibold">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                name="aadhaar"
                type="tel"
                placeholder="12 digits"
                maxLength="12"
                value={formData.aadhaar}
                onChange={handleInputChange}
                disabled={loading}
                className="mt-2 border-gray-300 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">Your 12-digit Aadhaar number</p>
            </div>

            <Button
              onClick={isSignup ? handleSignup : handleSignin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 h-auto"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : isSignup ? "Create Account" : "Login"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
              className="w-full border-gray-300 hover:bg-gray-50 text-gray-700"
            >
              {isSignup ? "Already have account? Sign in" : "Create new account"}
            </Button>
          </CardContent>

          <div className="px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Your data is secure. We protect your privacy.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
