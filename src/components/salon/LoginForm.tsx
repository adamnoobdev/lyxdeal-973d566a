
import React from "react";
import { useLoginForm } from "@/hooks/salon/useLoginForm";
import { LoginFormFields } from "./login/LoginFormFields";

interface SalonLoginFormProps {
  onForgotPassword: () => void;
}

export const SalonLoginForm: React.FC<SalonLoginFormProps> = ({ onForgotPassword }) => {
  const {
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
    handleSignIn
  } = useLoginForm();

  return (
    <LoginFormFields
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      loading={loading}
      captchaToken={captchaToken}
      loginAttempts={loginAttempts}
      showCaptcha={showCaptcha}
      securityMessage={securityMessage}
      handleVerificationSuccess={handleVerificationSuccess}
      handleSubmit={handleSignIn}
      onForgotPassword={onForgotPassword}
    />
  );
};
