
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { SecurityMessage } from "./SecurityMessage";
import { MAX_LOGIN_ATTEMPTS } from "@/hooks/salon/useLoginForm";

// HCaptcha site key
const CAPTCHA_SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  captchaToken: string | null;
  loginAttempts: number;
  showCaptcha: boolean;
  securityMessage: string | null;
  handleVerificationSuccess: (token: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  captchaToken,
  loginAttempts,
  showCaptcha,
  securityMessage,
  handleVerificationSuccess,
  handleSubmit,
  onForgotPassword
}) => {
  const captchaRef = React.useRef<HCaptcha>(null);
  
  // Reset captcha whenever showCaptcha changes
  React.useEffect(() => {
    if (showCaptcha && captchaRef.current) {
      try {
        captchaRef.current.resetCaptcha();
      } catch (error) {
        console.error('Fel vid återställning av captcha:', error);
      }
    }
  }, [showCaptcha]);

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">E-postadress</Label>
        <Input
          id="email"
          type="email"
          placeholder="namn@exempel.se"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Lösenord</Label>
          <Button
            type="button"
            variant="link"
            className="px-0 font-normal h-auto text-xs text-muted-foreground"
            onClick={onForgotPassword}
            disabled={loading}
          >
            Glömt lösenord?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          className="w-full"
          autoComplete="current-password"
        />
      </div>
      
      {showCaptcha && (
        <div className="py-3">
          <HCaptcha
            ref={captchaRef}
            sitekey={CAPTCHA_SITE_KEY}
            onVerify={handleVerificationSuccess}
            onExpire={() => {
              console.log('Captcha har löpt ut, återställer...');
              if (captchaRef.current) {
                captchaRef.current.resetCaptcha();
              }
            }}
            onError={(err) => {
              console.error('Captcha fel:', err);
            }}
          />
        </div>
      )}

      <SecurityMessage 
        message={securityMessage} 
        captchaVerified={!!captchaToken} 
      />
      
      <Button
        type="submit"
        className="w-full"
        disabled={loading || (loginAttempts >= MAX_LOGIN_ATTEMPTS && !captchaToken)}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loggar in...
          </>
        ) : (
          "Logga in"
        )}
      </Button>
    </form>
  );
};
