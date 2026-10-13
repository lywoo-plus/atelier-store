import type { Metadata } from "next";

import { AuthForm } from "@/components/auth-form";
import { brand } from "@/data/storefront";
import { googleEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: `Sign in | ${brand.name}`,
};

export default function SignInPage() {
  return (
    <main className="container-page section flex-1">
      <div className="mx-auto w-full max-w-sm">
        <p className="type-title-xs mb-3 text-muted">Welcome back</p>
        <h1 className="type-title-xl">Sign in</h1>
        <p className="type-body mt-4 mb-10 text-muted">Sign in to see your account.</p>
        <AuthForm mode="sign-in" googleEnabled={googleEnabled} />
      </div>
    </main>
  );
}
