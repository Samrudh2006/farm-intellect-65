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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold text-green-700">Smart Crop Advisory</CardTitle>
              <CardDescription className="text-lg mt-2">Select Your Role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {roles.map(role => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="group cursor-pointer transition-transform hover:scale-105"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <Icon className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="font-bold text-lg">{role.label}</h3>
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
    );
  }

  const currentRole = roles.find(r => r.id === selectedRole);
  const RoleIcon = currentRole?.icon || Sprout;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <button
              onClick={handleBackToRoles}
              className="mb-4 text-green-600 hover:text-green-700 flex items-center gap-2"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <RoleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <CardTitle>{isSignup ? "Create Account" : "Login"}</CardTitle>
                <CardDescription>{currentRole?.label}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <Label htmlFor="name">Full Name (Optional)</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-gray-600 font-medium">
                  +91
                </span>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="10 digits"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pin">Personal PIN</Label>
              <Input
                id="pin"
                name="pin"
                type="password"
                placeholder="6 digits"
                maxLength="6"
                value={formData.pin}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                name="aadhaar"
                placeholder="12 digits"
                maxLength="12"
                value={formData.aadhaar}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <Button
              onClick={isSignup ? handleSignup : handleSignin}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {loading ? "Loading..." : isSignup ? "Create Account" : "Login"}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
              className="w-full"
            >
              {isSignup ? "Already have account? Sign in" : "Create new account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
