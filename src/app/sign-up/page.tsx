import type { Metadata } from "next";

import { AuthForm } from "@/components/auth-form";
import { brand } from "@/data/storefront";
import { googleEnabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: `Create account | ${brand.name}`,
};

export default function SignUpPage() {
  return (
    <main className="container-page section flex-1">
      <div className="mx-auto w-full max-w-sm">
        <p className="type-title-xs mb-3 text-muted">Join the atelier</p>
        <h1 className="type-title-xl">Create account</h1>
        <p className="type-body mt-4 mb-10 text-muted">Create an account to keep your details in one place.</p>
        <AuthForm mode="sign-up" googleEnabled={googleEnabled} />
      </div>
    </main>
  );
}
