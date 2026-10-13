import Image from "next/image";
import Link from "next/link";

import { HeaderOverlay } from "@/components/header-overlay";
import { ArrowIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { feature, hero, services, stories } from "@/data/storefront";
import { getCollections, getNewArrivals } from "@/db/queries";

export default async function Home() {
  const [collections, newArrivals] = await Promise.all([getCollections(), getNewArrivals()]);

  return (
    <main className="flex-1">
      <HeaderOverlay />
      {/* Hero: one full-viewport image, title set low on the frame. */}
      <section className="theme-inverse relative">
        <div className="media h-svh min-h-[36rem] [--media-ratio:auto]">
          <Image src={hero.image} alt={hero.imageAlt} fill preload sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-black/30" />
        <div className="container-page absolute inset-x-0 bottom-0 flex flex-col gap-8 pb-8 lg:flex-row lg:items-end lg:justify-between lg:pb-12">
          <div>
            <p className="type-title-xs mb-4">{hero.kicker}</p>
            <h1 className="type-display">
              {hero.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            {hero.actions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                prefetch={false}
                className="btn btn-glass"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Collections: a swipeable rail on small screens, four across on desktop. */}
      <section className="section" aria-labelledby="collections-title">
        <div className="container-page mb-6 flex items-end justify-between lg:mb-8">
          <h2 id="collections-title" className="type-title-lg">
            Collections
          </h2>
          <p className="type-body-sm text-muted">Autumn Winter 2026</p>
        </div>
        <ul className="rail">
          {collections.map((collection) => (
            <li
              key={collection.slug}
              className="w-[72vw] md:w-[40vw] lg:w-[calc((100%-var(--grid-gap)*3)/4)]"
            >
              <Link
                href={`/collections/${collection.slug}`}
                prefetch={false}
                className="product-card group"
              >
                <div className="media media-portrait media-zoom">
                  <Image
                    src={collection.image}
                    alt={collection.imageAlt}
                    fill
                    sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 40vw, 72vw"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-4 px-1">
                  <h3 className="type-title-sm">{collection.name}</h3>
                  <p className="type-body-sm text-muted">{collection.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* New arrivals */}
      <section
        id="new-arrivals"
        className="container-page section-tight scroll-mt-header"
        aria-labelledby="new-arrivals-title"
      >
        <div className="mb-6 flex items-end justify-between lg:mb-8">
          <h2 id="new-arrivals-title" className="type-title-lg">
            New arrivals
          </h2>
          <Link href="/collections/new" prefetch={false} className="link type-label">
            View all
          </Link>
        </div>
        <div className="product-grid">
          {newArrivals.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
              // Three columns on tablets: drop the last two so no row is left short.
              className={index >= 6 ? "md:max-lg:hidden" : ""}
            />
          ))}
        </div>
      </section>

      {/* Feature: image and text side by side on an inverted surface. */}
      <section className="theme-inverse mt-section" aria-labelledby="feature-title">
        <div className="grid lg:grid-cols-2">
          <div className="media media-portrait lg:h-full lg:min-h-[48rem] lg:[--media-ratio:auto]">
            <Image
              src={feature.image}
              alt={feature.imageAlt}
              fill
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="object-top"
            />
          </div>
          <div className="container-content section flex flex-col justify-center lg:py-24">
            <p className="type-title-xs mb-6">{feature.kicker}</p>
            <h2 id="feature-title" className="type-title-2xl max-w-[12ch]">
              {feature.title}
            </h2>
            <p className="type-body mt-6 max-w-md">{feature.body}</p>
            <div className="mt-10">
              <Link href={feature.href} prefetch={false} className="btn btn-secondary">
                {feature.cta}
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stories: two tall editorial frames. */}
      <section className="container-page section" aria-label="Stories">
        <ul className="grid gap-grid md:grid-cols-2">
          {stories.map((story) => (
            <li key={story.href}>
              <Link
                href={story.href}
                prefetch={false}
                className="theme-inverse group relative block"
              >
                <div className="media media-portrait media-zoom">
                  <Image
                    src={story.image}
                    alt={story.imageAlt}
                    fill
                    sizes="(min-width: 48rem) 50vw, 100vw"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent to-50%" />
                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-8">
                  <p className="type-title-xs mb-2">{story.kicker}</p>
                  <h3 className="type-title-xl">{story.title}</h3>
                  <p className="type-label mt-4">
                    <span className="link">{story.cta}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Services */}
      <section className="container-page pb-section" aria-label="Client services">
        <ul className="divider grid md:grid-cols-3">
          {services.map((service) => (
            <li
              key={service.title}
              className="border-b border-line py-6 md:border-b-0 md:px-6 md:first:pl-0 md:not-first:border-l lg:py-10"
            >
              <h3 className="type-title-xs">{service.title}</h3>
              <p className="type-body-sm mt-2 max-w-xs text-muted">{service.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
