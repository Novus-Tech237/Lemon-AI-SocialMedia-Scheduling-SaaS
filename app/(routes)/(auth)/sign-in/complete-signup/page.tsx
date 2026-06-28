"use client";

import { useSignUp } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const REDIRECT_AFTER_AUTH = "/";

const RANDOM_WORDS = [
  "blaze", "comet", "drift", "ember", "flare", "frost", "gleam", "grove",
  "haze", "ignis", "jade", "kite", "lumen", "mist", "nova", "onyx",
  "pixel", "quill", "ridge", "shard", "spark", "storm", "swirl", "thorn",
  "titan", "trace", "vault", "wave", "wisp", "zenit",
];

function generateUsername(lastName: string | null | undefined): string {
  const base = (lastName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);
  const word = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
  return base.length >= 1 ? `${base}_${word}` : `user_${word}`;
}

export default function CompleteSignUpPage() {
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!signUp) return;
    if (fetchStatus !== "idle") return;
    if (ran.current) return;
    ran.current = true;

    const complete = async () => {
      try {
        // Auto-generate a username when the OAuth provider didn't supply one.
        if ((signUp.missingFields as string[])?.includes("username")) {
          const username = generateUsername(signUp.lastName);
          const { error } = await signUp.update({ username });
          if (error) {
            setError(error.longMessage ?? error.message ?? "Failed to set username.");
            return;
          }
        }

        if (signUp.status === "complete") {
          const { error } = await signUp.finalize();
          if (error) {
            setError(error.longMessage ?? error.message ?? "Failed to finalize sign-up.");
            return;
          }
          router.replace(REDIRECT_AFTER_AUTH);
          return;
        }

        // Unexpected incomplete state — fall back to sign-up.
        router.replace("/sign-up");
      } catch (err: unknown) {
        const e = err as {
          errors?: Array<{ longMessage?: string; message?: string }>;
          message?: string;
        };
        console.error("[COMPLETE_SIGNUP]", err);
        setError(
          e?.errors?.[0]?.longMessage ??
            e?.errors?.[0]?.message ??
            e?.message ??
            "Something went wrong. Please try again.",
        );
      }
    };

    complete();
  }, [fetchStatus, signUp, router]);

  if (error) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, rgb(10,10,12) 0%, rgb(24,24,27) 45%, rgb(39,39,42) 100%)",
        }}
      >
        <p className="text-sm text-white/80 max-w-sm text-center">{error}</p>
        <a href="/sign-up" className="text-white text-sm hover:text-white/80 underline">
          Try again
        </a>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-3"
      style={{
        background:
          "linear-gradient(135deg, rgb(10,10,12) 0%, rgb(24,24,27) 45%, rgb(39,39,42) 100%)",
      }}
    >
      <Loader2 className="animate-spin text-white" size={32} />
      <p className="text-sm text-white/80">Setting up your account…</p>
    </div>
  );
}
