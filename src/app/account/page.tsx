import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { SignOutButton } from "@/components/sign-out-button";
import { brand } from "@/data/storefront";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = {
  title: `Account | ${brand.name}`,
};

export default function AccountPage() {
  return (
    <main className="container-page section flex-1">
      <div className="mx-auto w-full max-w-sm">
        <p className="type-title-xs mb-3 text-muted">Your account</p>
        {/* The session is read at request time, so it streams in behind the boundary. */}
        <Suspense fallback={<div aria-busy="true" className="h-40" />}>
          <AccountDetails />
        </Suspense>
      </div>
    </main>
  );
}

async function AccountDetails() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <>
      <h1 className="type-title-xl">{user.name}</h1>
      <dl className="type-body-sm divider mt-10 flex justify-between py-4">
        <dt className="text-muted">Email address</dt>
        <dd className="type-label">{user.email}</dd>
      </dl>
      <div className="divider pt-6">
        <SignOutButton />
      </div>
    </>
  );
}
