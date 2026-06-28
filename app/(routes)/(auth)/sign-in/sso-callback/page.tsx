"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SsoCallbackPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{
        background:
          "linear-gradient(135deg, rgb(10,10,12) 0%, rgb(24,24,27) 45%, rgb(39,39,42) 100%)",
      }}
    >
      <Loader2 className="animate-spin text-white" size={32} />
      <p className="text-sm text-white/80">Finishing sign-in…</p>
      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/"
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
        continueSignUpUrl="/sign-in/complete-signup"
      />
    </div>
  );
}
