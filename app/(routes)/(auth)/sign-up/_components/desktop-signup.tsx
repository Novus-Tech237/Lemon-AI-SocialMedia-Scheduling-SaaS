"use client";

import React, { useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import ProfileOverlay from "@/components/auth/profile-overlay";
import { GoogleIcon, GithubIcon } from "@/components/auth/oauth-icons";
import TextType from "../../sign-in/_components/text";

type Step = "credentials" | "otp";
type OAuthStrategy = "oauth_google" | "oauth_github";

const REDIRECT_AFTER_AUTH = "/";

export default function DesktopSignUp() {
  const { signUp, fetchStatus, errors } = useSignUp();

  const [step, setStep] = useState<Step>("credentials");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = ["/images/signup.jpg"];

  const loading = fetchStatus === "fetching" || submitting;
  const isDisabled = loading;

  const errorMessage =
    oauthError ??
    errors?.global?.[0]?.longMessage ??
    errors?.global?.[0]?.message ??
    (errors?.fields
      ? Object.values(errors.fields).find(Boolean)?.message
      : null) ??
    null;

  const handleOAuth = async (strategy: OAuthStrategy) => {
    setOauthError(null);
    if (!signUp) {
      setOauthError(
        "Auth client not ready yet — please try again in a second.",
      );
      return;
    }
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const result = await signUp.sso({
        strategy,
        redirectUrl: `${origin}${REDIRECT_AFTER_AUTH}`,
        redirectCallbackUrl: `${origin}/sign-in/sso-callback`,
      });
      const redirectUrlObj =
        signUp.verifications?.externalAccount?.externalVerificationRedirectURL;
      const redirectHref =
        redirectUrlObj instanceof URL
          ? redirectUrlObj.toString()
          : redirectUrlObj;
      if (redirectHref) {
        window.location.assign(redirectHref);
        return;
      }
      if (result?.error) {
        setOauthError(
          result.error.longMessage ??
            result.error.message ??
            `OAuth (${strategy}) failed`,
        );
      } else {
        setOauthError(
          `OAuth (${strategy}) returned no redirect URL — the provider is likely not enabled in your Clerk dashboard.`,
        );
      }
    } catch (err) {
      const e = err as {
        errors?: Array<{ longMessage?: string; message?: string }>;
        message?: string;
      };
      setOauthError(
        e?.errors?.[0]?.longMessage ??
          e?.errors?.[0]?.message ??
          e?.message ??
          String(err),
      );
    }
  };

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || submitting) return;
    setSubmitting(true);
    setOauthError(null);
    try {
      const { error } = await signUp.password({
        emailAddress: email,
        password,
        firstName,
        lastName,
      });
      if (error) return;

      if (signUp.unverifiedFields?.includes("email_address")) {
        await signUp.verifications.sendEmailCode();
        setStep("otp");
      } else if (signUp.status === "complete") {
        await signUp.finalize();
        window.location.assign(REDIRECT_AFTER_AUTH);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setOauthError(null);
    if (!signUp || submitting) return;
    setSubmitting(true);
    try {
      const verifyRes = await signUp.verifications.verifyEmailCode({
        code: otpCode,
      });
      if (verifyRes.error) {
        setOauthError(
          verifyRes.error.longMessage ??
            verifyRes.error.message ??
            "Verification failed",
        );
        return;
      }

      if (signUp.status !== "complete") {
        const missing = [
          ...(signUp.missingFields ?? []),
          ...(signUp.unverifiedFields ?? []),
        ]
          .filter(Boolean)
          .join(", ");
        setOauthError(
          `Sign-up not complete (status: ${signUp.status}). Missing/unverified: ${missing || "unknown"}.`,
        );
        return;
      }

      const finalizeRes = await signUp.finalize();
      if (finalizeRes?.error) {
        setOauthError(
          finalizeRes.error.longMessage ??
            finalizeRes.error.message ??
            "Could not finalize session",
        );
        return;
      }
      window.location.assign(REDIRECT_AFTER_AUTH);
    } finally {
      setSubmitting(false);
    }
  };

  if (!signUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-900" />
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .bg-school {
          background-size: cover;
          background-position: center;
          transition: background-image 1s ease-in-out;
        }
        .overlay {
          background: linear-gradient(135deg, rgba(10,10,12,0.88) 0%, rgba(24,24,27,0.76) 45%, rgba(39,39,42,0.64) 100%);
        }
        .float-anim { animation: floatUp 0.7s ease both; }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .float-anim:nth-child(1) { animation-delay: 0.1s; }
        .float-anim:nth-child(2) { animation-delay: 0.25s; }
        .float-anim:nth-child(3) { animation-delay: 0.4s; }
        .quote-mark {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          line-height: 1;
          color: rgba(255,255,255,0.22);
          display: block;
          margin-bottom: -0.5rem;
        }
        .sign-in-input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #f9fafb;
        }
        .sign-in-input:focus {
          border-color: #111827;
          box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.12);
          background: #fff;
        }
        .sign-in-btn {
          width: 100%;
          background: #111827;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 0;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          font-family: 'DM Sans', sans-serif;
          margin-top: 4px;
        }
        .sign-in-btn:hover:not(:disabled) {
          background: #1f2937;
          transform: translateY(-1px);
        }
        .sign-in-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .carousel-dots {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
          margin-top: 12px;
        }
        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }
        .carousel-dot.active {
          background: rgba(255, 255, 255, 0.9);
          width: 24px;
          border-radius: 4px;
        }
      `}</style>

      <div className="min-h-screen flex flex-col md:flex-row">
        {/* LEFT PANEL — sign-up form (the only panel shown on mobile) */}

        {/* RIGHT PANEL — marketing (mirrored) */}
        <div className="basis-2/3 hidden md:flex relative overflow-hidden">
          <div
            className="absolute inset-0 bg-school"
            style={{
              backgroundImage: `url('${backgroundImages[currentImageIndex]}')`,
            }}
          />
          <div className="absolute inset-0 overlay" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />
          <div className="relative z-10 flex flex-col justify-between w-full px-12 py-10">
            <div className="flex items-center justify-between float-anim" />
            <div className="flex flex-col gap-6 pb-12">
              <div className="float-anim">
                <span className="quote-mark">&ldquo;</span>
                <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight">
                  One workspace for <br /> every{" "}
                  <TextType
                    as="span"
                    className="text-black [-webkit-text-stroke:1px_white]"
                    text={["channel.", "platform.", "network."]}
                    typingSpeed={75}
                    deletingSpeed={50}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="_"
                    cursorBlinkDuration={0.5}
                  />
                </h1>
              </div>
              <p className="text-white/60 text-sm xl:text-base max-w-sm leading-relaxed float-anim">
                Draft once, adapt per platform, and keep your whole schedule
                under control.
              </p>
            </div>

            {/* <div className="flex flex-col items-start gap-2 float-anim">
              <div className="flex items-center gap-4">
                <ProfileOverlay />
                <span className="text-white/70 text-sm">
                  Join creators scheduling with ANA AI
                </span>
              </div>
          
            </div> */}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between bg-white min-h-screen px-6 py-8 md:px-12 md:py-10">
          <div className="flex justify-center md:justify-start">
            <Link href="/">
            <Image
              src="/images/ana-b.png"
              alt="ANA AI"
              width={140}
              height={48}
              className="h-9 w-auto object-contain"
              priority
            />
            </Link>  
          </div>

          <div className="flex flex-col gap-6 w-full max-w-sm mx-auto md:mx-0 mt-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Create your account
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Sign up to start scheduling with ANA AI.
              </p>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {errorMessage}
              </p>
            )}

            {step === "credentials" && (
              <>
                <form
                  onSubmit={handlePasswordSignUp}
                  className="flex flex-col gap-4"
                >
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs text-gray-500 font-medium">
                        First Name
                      </label>
                      <input
                        className="sign-in-input"
                        type="text"
                        placeholder="Jane"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-xs text-gray-500 font-medium">
                        Last Name
                      </label>
                      <input
                        className="sign-in-input"
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">
                      Email Address
                    </label>
                    <input
                      className="sign-in-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500 font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="sign-in-input pr-10"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    className="sign-in-btn"
                    type="submit"
                    disabled={loading || fetchStatus !== "idle"}
                  >
                    {loading ? "Creating account…" : "Create Account"}
                  </button>

                  {/* Clerk bot sign-up protection mounts its CAPTCHA here.
                      Required for custom sign-up flows — without it, Smart
                      CAPTCHA can't initialize and password sign-up fails. */}
                  <div id="clerk-captcha" />
                </form>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="text-xs text-gray-400 font-medium">or</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                <div className="flex gap-3">
                  {[
                    {
                      strategy: "oauth_google" as OAuthStrategy,
                      label: "Google",
                      Icon: GoogleIcon,
                    },
                   
                  ].map(({ strategy, label, Icon }) => (
                    <button
                      key={strategy}
                      type="button"
                      onClick={() => handleOAuth(strategy)}
                      disabled={isDisabled}
                      className="flex-1 h-10 gap-2 flex items-center justify-center rounded-lg transition-colors bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:border-gray-400 disabled:opacity-60"
                    >
                      <Icon className="shrink-0" />
                      <span className="text-black whitespace-nowrap text-xs">{`Sign up with ${label}`}</span>
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-gray-900 hover:text-black"
                  >
                    Sign in
                  </Link>
                </p>
              </>
            )}

            {step === "otp" && (
              <form
                onSubmit={handleOtpVerification}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 font-medium">
                    Verification Code
                  </label>
                  <input
                    className="sign-in-input text-center text-2xl tracking-widest font-semibold"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    Enter the 6-digit code sent to {email || "your email"}
                  </p>
                </div>

                <button
                  className="sign-in-btn"
                  type="submit"
                  disabled={
                    loading || fetchStatus !== "idle" || otpCode.length !== 6
                  }
                >
                  {loading ? "Verifying…" : "Verify & Continue"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors font-medium text-center pt-2"
                >
                  ← Back to sign up
                </button>
              </form>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} ANA AI. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}
