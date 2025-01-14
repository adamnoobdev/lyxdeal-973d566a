import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/salon/LoginForm";

export default function SalonLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-lg">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Välkommen till Lyxdeal
          </h1>
          <p className="text-muted-foreground">
            Logga in för att hantera din salong
          </p>
        </div>

        <LoginForm 
          email={email}
          password={password}
          loading={loading}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      </Card>
    </div>
  );
}