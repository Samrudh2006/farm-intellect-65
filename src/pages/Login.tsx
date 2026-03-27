import { useState } from "react";
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
import farmerImg from "@/assets/roles/farmer-role.jpg";
import merchantImg from "@/assets/roles/merchant-role.jpg";
import expertImg from "@/assets/roles/expert-role.jpg";
import adminImg from "@/assets/roles/admin-role.jpg";

const PASSKEY_USERS_KEY = "passkey_users";

type PasskeyUserRecord = {
  userId: string;
  passkeyHash: string;
  passkeySalt: string;
  role: string;
  profile: {
    display_name: string;
    phone?: string;
    location?: string;
    avatar_url?: string;
  };
};

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setPasskeySession } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [confirmPasskey, setConfirmPasskey] = useState("");

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsLogin(true);
    setPasskey("");
    setConfirmPasskey("");
  };

  const normalizePasskey = (value: string) => value.replace(/\D/g, "").slice(0, 6);

  const loadPasskeyUsers = () => {
    try {
      const rawUsers = localStorage.getItem(PASSKEY_USERS_KEY);
      if (!rawUsers) return {};
      return JSON.parse(rawUsers) as Record<string, PasskeyUserRecord>;
    } catch (error) {
      console.error("Failed to parse passkey users:", error);
      return {};
    }
  };

  const savePasskeyUsers = (users: Record<string, PasskeyUserRecord>) => {
    localStorage.setItem(PASSKEY_USERS_KEY, JSON.stringify(users));
  };

  const bytesToHex = (bytes: Uint8Array) =>
    Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

  const hexToBytes = (hex: string) => {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  };

  const derivePasskeyHash = async (value: string, salt?: string) => {
    if (!window.crypto?.subtle || !window.crypto?.getRandomValues) {
      throw new Error("Passkey hashing is not supported in this browser.");
    }

    const passkeyBytes = new TextEncoder().encode(value);
    const saltBytes = salt ? hexToBytes(salt) : window.crypto.getRandomValues(new Uint8Array(16));
    const key = await window.crypto.subtle.importKey("raw", passkeyBytes, "PBKDF2", false, ["deriveBits"]);
    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: 100000,
        hash: "SHA-256",
      },
      key,
      256,
    );

    return {
      hash: bytesToHex(new Uint8Array(derivedBits)),
      salt: bytesToHex(saltBytes),
    };
  };

  const createDefaultProfile = (role: string) => ({
    display_name: role.charAt(0).toUpperCase() + role.slice(1),
    phone: "",
    location: "",
    avatar_url: "",
  });

  const buildSessionFromRecord = (record: PasskeyUserRecord) => ({
    id: record.userId,
    role: record.role,
    display_name: record.profile.display_name || "User",
    phone: record.profile.phone || "",
    location: record.profile.location || "",
    avatar_url: record.profile.avatar_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      return;
    }

    if (passkey.length !== 6) {
      toast({ title: "Invalid passkey", description: "Passkey must be exactly 6 digits.", variant: "destructive" });
      return;
    }

    if (!isLogin && passkey !== confirmPasskey) {
      toast({ title: "Passkeys do not match", description: "Please re-enter your passkey.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const users = loadPasskeyUsers();
      const roleKey = selectedRole;

      if (isLogin) {
        const record = users[roleKey];
        if (!record) {
          toast({ title: "Passkey not found", description: "Create a passkey for this role to continue.", variant: "destructive" });
          return;
        }

        const { hash } = await derivePasskeyHash(passkey, record.passkeySalt);
        if (hash !== record.passkeyHash) {
          toast({ title: "Invalid passkey", description: "The passkey you entered is incorrect.", variant: "destructive" });
          return;
        }

        setPasskeySession(buildSessionFromRecord(record));
        toast({ title: t("auth.login_success"), description: t("auth.welcome_back") });
      } else {
        if (users[roleKey]) {
          toast({ title: "Passkey already exists", description: "Please sign in with your existing passkey.", variant: "destructive" });
          return;
        }

        const { hash, salt } = await derivePasskeyHash(passkey);
        const userId = window.crypto?.randomUUID
          ? window.crypto.randomUUID()
          : `${roleKey}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
        const record: PasskeyUserRecord = {
          userId,
          passkeyHash: hash,
          passkeySalt: salt,
          role: roleKey,
          profile: createDefaultProfile(roleKey),
        };

        users[roleKey] = record;
        savePasskeyUsers(users);
        setPasskeySession(buildSessionFromRecord(record));
        toast({ title: "Passkey created", description: "Your 6-digit passkey is ready to use." });
      }

      const routes: Record<string, string> = {
        farmer: "/farmer/dashboard",
        merchant: "/merchant/dashboard",
        expert: "/expert/dashboard",
        admin: "/admin/dashboard",
      };
      navigate(routes[selectedRole] || "/farmer/dashboard");
    } catch (error) {
      console.error("Passkey flow error:", error);
      toast({
        title: "Passkey login unavailable",
        description: "Please use a modern browser that supports secure passkey hashing.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <CardDescription>
                {isLogin ? "Enter your 6-digit passkey to continue." : "Create a 6-digit passkey for this role."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="passkey" className="flex items-center gap-2">
                    6-digit Passkey
                  </Label>
                  <Input
                    id="passkey"
                    type="password"
                    inputMode="numeric"
                    placeholder="Enter 6-digit passkey"
                    maxLength={6}
                    value={passkey}
                    onChange={(e) => setPasskey(normalizePasskey(e.target.value))}
                    required
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-1.5">
                    <Label htmlFor="confirm-passkey" className="flex items-center gap-2">
                      Confirm Passkey
                    </Label>
                    <Input
                      id="confirm-passkey"
                      type="password"
                      inputMode="numeric"
                      placeholder="Re-enter passkey"
                      maxLength={6}
                      value={confirmPasskey}
                      onChange={(e) => setConfirmPasskey(normalizePasskey(e.target.value))}
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
                  ) : isLogin ? t("auth.signin") : t("auth.signup")}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPasskey("");
                    setConfirmPasskey("");
                  }}
                  className="text-sm text-primary hover:underline"
                >
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
    </div>
  );
};

export default Login;
