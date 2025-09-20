import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Mail, 
  Phone, 
  Shield, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  ArrowLeft 
} from "lucide-react";

interface OTPVerificationProps {
  type: 'email' | 'sms';
  contact: string;
  purpose: string;
  userId: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const OTPVerification = ({ 
  type, 
  contact, 
  purpose, 
  userId, 
  onVerified, 
  onCancel 
}: OTPVerificationProps) => {
  const { t } = useLanguage();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Mock verification function (replace with actual API call)
  const verifyOTP = async () => {
    setIsVerifying(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock verification logic - accept any 6-digit OTP for demo
      if (otp.length === 6 && /^\d+$/.test(otp)) {
        onVerified();
      } else {
        setError("Invalid OTP. Please enter a valid 6-digit code.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    setIsResending(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimeLeft(300);
      setOtp("");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            {type === 'email' ? (
              <Mail className="h-5 w-5 text-primary" />
            ) : (
              <Phone className="h-5 w-5 text-primary" />
            )}
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to your {type === 'email' ? 'email' : 'phone'}
          <br />
          <span className="font-medium">{contact}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter Verification Code</Label>
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            className="justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resendOTP}
            disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
            className="h-auto p-0"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>

        <Button
          onClick={verifyOTP}
          disabled={otp.length !== 6 || isVerifying}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Code
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Didn't receive the code? Check your spam folder or try a different method.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};