
import React from "react";
import { useLoginForm } from "@/hooks/salon/useLoginForm";
import { LoginFormFields } from "./login/LoginFormFields";

export const SalonLoginForm: React.FC = () => {
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
    />
  );
};
