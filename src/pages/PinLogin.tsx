import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sprout, ShoppingBag, Award, Settings } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { PinAuth } from "@/services/pinAuth";

const PinLogin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone: "",
    pin: "",
    aadhaar: "",
    name: "",
  });

  const roles = [
    { id: "farmer", label: "Farmer", icon: Sprout, desc: "Agricultural Advisor" },
    { id: "merchant", label: "Merchant", icon: ShoppingBag, desc: "Agriculture Trader" },
    { id: "expert", label: "Expert", icon: Award, desc: "Agricultural Expert" },
    { id: "admin", label: "Admin", icon: Settings, desc: "Administrator" },
  ];

  const handleInputChange = (field: string, value: string) => {
    // Only allow numbers for phone, pin, aadhaar
    if (["phone", "pin", "aadhaar"].includes(field)) {
      value = value.replace(/\D/g, "");
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateInputs = (requirePin = true) => {
    if (!PinAuth.validatePhone(formData.phone)) {
      toast({ title: t("auth.error"), description: "Phone must be 10 digits", variant: "destructive" });
      return false;
    }
    if (requirePin && !PinAuth.validatePin(formData.pin)) {
      toast({ title: t("auth.error"), description: "PIN must be 6 digits", variant: "destructive" });
      return false;
    }
    if (!PinAuth.validateAadhaar(formData.aadhaar)) {
      toast({ title: t("auth.error"), description: "Aadhaar must be 12 digits", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!selectedRole) {
      toast({ title: t("auth.error"), description: "Please select a role", variant: "destructive" });
      return;
    }
    
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const phone = PinAuth.formatPhone(formData.phone);
      const result = await PinAuth.signup(
        phone,
        formData.pin,
        formData.aadhaar,
        formData.name || undefined,
        selectedRole.toUpperCase()
      );

      if (result.success && result.token) {
        const userData = {
          id: result.user?.id,
          phone: result.user?.phone,
          role: result.user?.role?.toLowerCase() || selectedRole,
          displayName: result.user?.name || formData.name,
          aadhaar: result.user?.aadhaar,
        };

        localStorage.setItem("farmer_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", result.token);

        toast({ title: "Account Created!", description: "Welcome to Smart Crop Advisory!" });
        const routes: Record<string, string> = {
          farmer: "/farmer/dashboard",
          merchant: "/merchant/dashboard",
          expert: "/expert/dashboard",
          admin: "/admin/dashboard",
        };
        navigate(routes[selectedRole] || "/farmer/dashboard");
      } else {
        toast({ title: t("auth.error"), description: result.error || "Signup failed", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: t("auth.error"), description: error.message || "Signup failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const phone = PinAuth.formatPhone(formData.phone);
      const result = await PinAuth.signin(
        phone,
        formData.pin,
        formData.aadhaar
      );

      if (result.success && result.token) {
        const userData = {
          id: result.user?.id,
          phone: result.user?.phone,
          role: result.user?.role?.toLowerCase() || "farmer",
          displayName: result.user?.name,
          aadhaar: result.user?.aadhaar,
        };

        localStorage.setItem("farmer_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", result.token);

        toast({ title: t("auth.login_success"), description: "Welcome back!" });
        const routes: Record<string, string> = {
          farmer: "/farmer/dashboard",
          merchant: "/merchant/dashboard",
          expert: "/expert/dashboard",
          admin: "/admin/dashboard",
        };
        navigate(routes[result.user?.role?.toLowerCase() || "farmer"] || "/farmer/dashboard");
      } else {
        toast({ title: t("auth.error"), description: result.error || "Invalid credentials", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: t("auth.error"), description: error.message || "Signin failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-4 text-green-800">Smart Crop Advisory</h1>
          <p className="text-center text-gray-600 mb-12">Choose your role to get started</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map(role => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className="group cursor-pointer"
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="w-full h-32 flex items-center justify-center bg-green-100 rounded-lg mb-4">
                        <Icon className="w-16 h-16 text-green-600" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{role.label}</h3>
                      <p className="text-sm text-gray-600">{role.desc}</p>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const currentRole = roles.find(r => r.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setSelectedRole(null)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Roles
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              {currentRole && (
                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded">
                  {(() => {
                    const Icon = currentRole.icon;
                    return <Icon className="w-6 h-6 text-green-600" />;
                  })()}
                </div>
              )}
              <div>
                <CardTitle>{isSignup ? "Create Account" : "Login"}</CardTitle>
                <CardDescription>{currentRole?.label}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="10-digit phone number"
                maxLength="10"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={loading}
              />
            </div>

            {/* PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin">
                {isSignup ? "Create a 6-Digit PIN" : "Enter Your PIN"}
              </Label>
              <Input
                id="pin"
                type="password"
                placeholder="6-digit PIN"
                maxLength="6"
                value={formData.pin}
                onChange={(e) => handleInputChange("pin", e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                {isSignup ? "Use this PIN every time you login" : "The PIN you created during signup"}
              </p>
            </div>

            {/* Aadhaar */}
            <div className="space-y-2">
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                placeholder="12-digit Aadhaar number"
                maxLength="12"
                value={formData.aadhaar}
                onChange={(e) => handleInputChange("aadhaar", e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Name - Signup only */}
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full"
              onClick={isSignup ? handleSignup : handleSignin}
              disabled={loading}
            >
              {loading ? "Processing..." : isSignup ? "Create Account" : "Login"}
            </Button>

            {/* Toggle Signup/Signin */}
            <button
              type="button"
              className="w-full text-center text-sm text-blue-600 hover:underline"
              onClick={() => {
                setIsSignup(!isSignup);
                setFormData({ phone: "", pin: "", aadhaar: "", name: "" });
              }}
              disabled={loading}
            >
              {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
            </button>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-gray-500 mt-6">
          Your data is securely stored. Never share your PIN with anyone.
        </p>
      </div>
    </div>
  );
};

export default PinLogin;
