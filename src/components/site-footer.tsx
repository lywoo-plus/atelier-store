import Link from "next/link";

import { brand, footerNav } from "@/data/storefront";
import { getNavigation } from "@/db/queries";

import { ArrowIcon } from "./icons";

export async function SiteFooter() {
  const categories = await getNavigation();
  const groups = [{ title: "Shop", links: categories }, ...footerNav];

  return (
    <footer className="theme-inverse">
      <div className="container-page section grid-page gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <h2 className="type-title-md">Letters from the atelier</h2>
          <p className="type-body-sm mt-2 max-w-sm text-muted">
            New collections, private previews and stories from the workshop.
          </p>
          <form className="mt-6 flex max-w-sm items-end gap-4 border-b border-line">
            <label className="flex-1">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Email address"
                className="type-body w-full bg-transparent py-3 placeholder:text-muted"
              />
            </label>
            <button type="button" aria-label="Subscribe" className="p-3">
              <ArrowIcon />
            </button>
          </form>
        </div>

        <nav
          aria-label="Footer"
          className="col-span-12 grid grid-cols-2 gap-x-grid gap-y-10 md:grid-cols-4 lg:col-span-7 lg:col-start-6"
        >
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="type-title-xs">{group.title}</h3>
              <ul className="type-body-sm stack mt-4 [--stack-gap:0.5rem]">
                {group.links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} prefetch={false} className="link-quiet">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="container-page overflow-hidden">
        <p
          aria-hidden="true"
          className="font-display text-center text-[25vw] leading-[0.8] tracking-tighter uppercase select-none"
        >
          {brand.name}
        </p>
      </div>

      <div className="container-page type-caption flex flex-col gap-2 py-6 text-muted md:flex-row md:justify-between">
        <p>{brand.name}. Sample storefront.</p>
        <p>United States · English · USD</p>
      </div>
    </footer>
  );
}
