"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { brand, type NavItem } from "@/data/storefront";

import { AccountIcon, BagIcon, CloseIcon, MenuIcon, SearchIcon } from "./icons";

/** Interactive part of the site header; rendered by `SiteHeader` with the category links. */
export function SiteHeaderBar({ overlay = false, nav }: { overlay?: boolean; nav: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const transparent = overlay && !scrolled;

  return (
    <>
      <header
        className={`header-bar ${overlay ? "header-bar-fixed" : ""} ${transparent ? "header-bar-overlay" : ""}`}
      >
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex gap-6 uppercase">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className="link-quiet">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          aria-label={`${brand.name} home`}
          className="font-display text-[1.75rem] leading-6 font-normal tracking-tight uppercase"
        >
          {brand.name}
        </Link>

        <ul className="flex items-center gap-4 lg:gap-6">
          <li>
            <Link href="/search" prefetch={false} aria-label="Search" className="block p-1">
              <SearchIcon />
            </Link>
          </li>
          <li className="hidden md:block">
            <Link href="/account" prefetch={false} aria-label="Account" className="block p-1">
              <AccountIcon />
            </Link>
          </li>
          <li>
            <Link href="/bag" prefetch={false} aria-label="Shopping bag" className="block p-1">
              <BagIcon />
            </Link>
          </li>
          <li className="lg:hidden">
            <button
              type="button"
              aria-label="Open menu"
              className="block p-1"
              onClick={() => menu.current?.showModal()}
            >
              <MenuIcon />
            </button>
          </li>
        </ul>
      </header>

      <dialog
        ref={menu}
        aria-label="Menu"
        className="h-dvh max-h-none w-full max-w-none bg-background text-foreground backdrop:bg-black/40"
        // Any link inside the menu dismisses it.
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) menu.current?.close();
        }}
      >
        <div className="flex h-full flex-col">
          <div className="flex min-h-header items-center justify-between px-gutter py-3">
            <span className="font-display text-[1.75rem] leading-6 tracking-tight uppercase">
              {brand.name}
            </span>
            <button
              type="button"
              aria-label="Close menu"
              className="block p-1"
              onClick={() => menu.current?.close()}
            >
              <CloseIcon />
            </button>
          </div>

          <nav aria-label="Menu" className="flex-1 overflow-y-auto px-gutter pt-8">
            <ul className="stack [--stack-gap:1rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} prefetch={false} className="type-title-xl block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="divider type-label flex gap-6 px-gutter py-6">
            <li>
              <Link href="/account" prefetch={false} className="link-quiet">
                Account
              </Link>
            </li>
            <li>
              <Link href="/boutiques" prefetch={false} className="link-quiet">
                Boutiques
              </Link>
            </li>
            <li>
              <Link href="/contact" prefetch={false} className="link-quiet">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </dialog>
    </>
  );
}
