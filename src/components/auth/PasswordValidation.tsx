import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordValidationProps {
  password: string;
  onValidationChange: (isValid: boolean) => void;
}

export const PasswordValidation = ({ password, onValidationChange }: PasswordValidationProps) => {
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noSpaces: false
  });

  useEffect(() => {
    const newValidations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noSpaces: !/\s/.test(password)
    };

    setValidations(newValidations);
    
    const isValid = Object.values(newValidations).every(Boolean);
    onValidationChange(isValid);
  }, [password, onValidationChange]);

  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={cn(
        isValid ? "text-green-700" : "text-red-700"
      )}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="space-y-2 p-3 bg-muted/50 rounded-md">
      <h4 className="text-sm font-medium">Password Requirements:</h4>
      <div className="space-y-1">
        <ValidationItem isValid={validations.length} text="At least 8 characters" />
        <ValidationItem isValid={validations.uppercase} text="One uppercase letter" />
        <ValidationItem isValid={validations.lowercase} text="One lowercase letter" />
        <ValidationItem isValid={validations.number} text="One number" />
        <ValidationItem isValid={validations.special} text="One special character" />
        <ValidationItem isValid={validations.noSpaces} text="No spaces" />
      </div>
    </div>
  );
};