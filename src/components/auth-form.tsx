"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { ArrowIcon } from "./icons";

const copy = {
  "sign-in": {
    submit: "Sign in",
    pending: "Signing in",
    prompt: "New to the atelier?",
    switchLabel: "Create an account",
    switchHref: "/sign-up",
  },
  "sign-up": {
    submit: "Create account",
    pending: "Creating account",
    prompt: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/sign-in",
  },
};

const fieldClass =
  "type-body w-full border-b border-line bg-transparent py-3 placeholder:text-muted focus:border-foreground";

/** Email and password form for the sign-in and sign-up pages. */
export function AuthForm({
  mode,
  googleEnabled,
}: {
  mode: keyof typeof copy;
  /** Show the Google button; only true when its OAuth keys are configured. */
  googleEnabled: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const text = copy[mode];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setPending(true);
    setError(null);
    const { error } =
      mode === "sign-up"
        ? await authClient.signUp.email({ name: String(form.get("name")), email, password })
        : await authClient.signIn.email({ email, password });

    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setPending(false);
      return;
    }
    // Refresh so nothing rendered before signing in is reused.
    router.push("/account");
    router.refresh();
  }

  async function onGoogle() {
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/account",
    });
    if (error) {
      setError(error.message ?? "Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="stack [--stack-gap:2rem]">
      <form onSubmit={onSubmit} className="stack [--stack-gap:1.5rem]">
        {mode === "sign-up" && (
          <label className="block">
            <span className="type-label">Name</span>
            <input type="text" name="name" autoComplete="name" required className={fieldClass} />
          </label>
        )}
        <label className="block">
          <span className="type-label">Email address</span>
          <input type="email" name="email" autoComplete="email" required className={fieldClass} />
        </label>
        <label className="block">
          <span className="type-label">Password</span>
          <input
            type="password"
            name="password"
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            minLength={8}
            required
            className={fieldClass}
          />
          {mode === "sign-up" && (
            <span className="type-body-sm mt-2 block text-muted">At least 8 characters.</span>
          )}
        </label>

        {error && (
          <p role="alert" className="type-body-sm text-danger">
            {error}
          </p>
        )}

        <div className="stack [--stack-gap:0.5rem]">
          <button type="submit" disabled={pending} className="btn btn-primary btn-fluid">
            <span>{pending ? text.pending : text.submit}</span>
            <ArrowIcon />
          </button>
          {googleEnabled && (
            <button
              type="button"
              disabled={pending}
              onClick={onGoogle}
              className="btn btn-secondary btn-fluid"
            >
              <span>Continue with Google</span>
              <ArrowIcon />
            </button>
          )}
        </div>
      </form>

      <p className="type-body-sm divider pt-6 text-muted">
        {text.prompt}{" "}
        <Link href={text.switchHref} prefetch={false} className="link text-foreground">
          {text.switchLabel}
        </Link>
      </p>
    </div>
  );
}
