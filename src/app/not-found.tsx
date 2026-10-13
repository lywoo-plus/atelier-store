import type { Metadata } from "next";
import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { brand } from "@/data/storefront";

export const metadata: Metadata = {
  title: `Page not found | ${brand.name}`,
};

export default function NotFound() {
  return (
    <main className="container-page section flex flex-1 flex-col items-start justify-center">
      <p className="type-title-xs mb-3 text-muted">404</p>
      <h1 className="type-title-xl">Page not found</h1>
      <p className="type-body mt-4 max-w-md text-muted">
        The page you are looking for has moved or no longer exists.
      </p>
      <div className="mt-10 flex flex-col gap-2 md:flex-row">
        <Link href="/collections/new" prefetch={false} className="btn btn-primary">
          Shop new arrivals
          <ArrowIcon />
        </Link>
        <Link href="/" prefetch={false} className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
