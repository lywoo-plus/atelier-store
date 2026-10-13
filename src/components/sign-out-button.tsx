"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await authClient.signOut();
    // Refresh so nothing rendered while signed in is reused.
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" disabled={pending} onClick={onClick} className="btn btn-secondary">
      {pending ? "Signing out" : "Sign out"}
    </button>
  );
}
