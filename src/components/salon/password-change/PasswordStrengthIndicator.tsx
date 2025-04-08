
import { Check, X } from "lucide-react";
import React from "react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
}) => {
  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  return (
    <div className="mt-2 space-y-1 text-sm">
      <p className="font-medium text-muted-foreground">Ditt lösenord måste innehålla:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        <div className="flex items-center">
          {hasMinLength ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
          <span className={hasMinLength ? "text-green-700" : "text-muted-foreground"}>Minst 8 tecken</span>
        </div>
        <div className="flex items-center">
          {hasUpperCase ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
          <span className={hasUpperCase ? "text-green-700" : "text-muted-foreground"}>Stor bokstav (A-Z)</span>
        </div>
        <div className="flex items-center">
          {hasLowerCase ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
          <span className={hasLowerCase ? "text-green-700" : "text-muted-foreground"}>Liten bokstav (a-z)</span>
        </div>
        <div className="flex items-center">
          {hasNumber ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
          <span className={hasNumber ? "text-green-700" : "text-muted-foreground"}>Minst en siffra</span>
        </div>
        <div className="flex items-center">
          {hasSpecialChar ? <Check size={14} className="text-green-500 mr-1" /> : <X size={14} className="text-red-500 mr-1" />}
          <span className={hasSpecialChar ? "text-green-700" : "text-muted-foreground"}>Specialtecken</span>
        </div>
      </div>
    </div>
  );
};
