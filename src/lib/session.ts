import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "./auth";

export type CurrentUser = { id: string; name: string; email: string };

/**
 * The signed-in customer, or null. Reads the request, so call it from a
 * component behind `<Suspense>`; repeated calls in one request share the read.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const { id, name, email } = session.user;
  return { id, name, email };
});
