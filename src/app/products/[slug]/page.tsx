import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArrowIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { SiteHeader } from "@/components/site-header";
import { brand, formatPrice, getStockState, type StockState } from "@/data/storefront";
import { getProduct, getProductSlugs, getRelated } from "@/db/queries";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | ${brand.name}`,
    description: product.description,
  };
}

const stockDot: Record<StockState["status"], string> = {
  "in-stock": "bg-success",
  "low-stock": "bg-warning",
  "sold-out": "bg-muted",
};

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* The slug is read inside the boundary so the route keeps a URL-independent shell. */}
        <Suspense fallback={<ProductFallback />}>
          <ProductContent params={params} />
        </Suspense>
      </main>
    </>
  );
}

/** Shell shown while a product that was not prerendered is loading. */
function ProductFallback() {
  return (
    <div aria-busy="true" className="lg:grid lg:grid-cols-12 lg:gap-grid lg:px-gutter">
      <div className="lg:col-span-8">
        <div className="media media-square lg:[--media-ratio:4/3]" />
      </div>
    </div>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const stock = getStockState(product.stock);
  const soldOut = stock.status === "sold-out";
  const related = await getRelated(product.id, product.categoryId);

  return (
    <>
      <div className="lg:grid lg:grid-cols-12 lg:gap-grid lg:px-gutter">
        {/* Gallery: a swipeable rail on small screens, a stacked column from lg. */}
        <ul
          aria-label="Product images"
          className="rail lg:col-span-8 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {product.gallery.map((image, index) => (
            <li key={image.src} className="w-[88vw] md:w-[60vw] lg:w-full">
              <div className="media media-square lg:[--media-ratio:4/3]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  preload={index === 0}
                  sizes="(min-width: 64rem) 66vw, (min-width: 48rem) 60vw, 88vw"
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Information: follows the gallery on small screens, pinned beside it from lg. */}
        <div className="px-gutter lg:col-span-4 lg:px-0">
          <div className="stack py-8 [--stack-gap:2rem] lg:sticky lg:top-header lg:px-6 lg:py-10">
            <header>
              <p className="type-title-xs text-muted">
                <Link
                  href={`/collections/${product.category.slug}`}
                  prefetch={false}
                  className="link-quiet"
                >
                  {product.category.name}
                </Link>
              </p>
              <h1 className="type-title-lg mt-3">{product.name}</h1>
              <p className={`type-body mt-3 ${soldOut ? "text-muted" : ""}`}>
                {formatPrice(product.priceCents)}
              </p>
              <p className="type-label mt-4 flex items-center gap-2" role="status">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${stockDot[stock.status]}`}
                />
                {stock.label}
              </p>
            </header>

            <dl className="type-body-sm divider flex justify-between pt-4">
              <dt className="text-muted">Colour</dt>
              <dd className="type-label">{product.colour}</dd>
            </dl>

            {product.sizes && (
              <fieldset>
                <legend className="type-body-sm flex w-full justify-between">
                  <span className="text-muted">Size</span>
                  <span className="text-muted">EU</span>
                </legend>
                <div className="mt-3 grid grid-cols-4 gap-1">
                  {product.sizes.map((size) => (
                    <label key={size.label} className="relative">
                      <input
                        type="radio"
                        name="size"
                        value={size.label}
                        disabled={size.stock === 0}
                        className="peer sr-only"
                      />
                      <span className="type-label flex h-12 cursor-pointer items-center justify-center border border-line transition-colors peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:outline-3 peer-focus-visible:-outline-offset-3 peer-focus-visible:outline-focus peer-disabled:cursor-not-allowed peer-disabled:text-muted peer-disabled:line-through hover:border-foreground peer-disabled:hover:border-line">
                        {size.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="stack [--stack-gap:0.5rem]">
              <button type="button" disabled={soldOut} className="btn btn-primary btn-fluid">
                <span>{soldOut ? "Sold out" : "Add to bag"}</span>
                <span>{formatPrice(product.priceCents)}</span>
              </button>
              <Link href="/boutiques" prefetch={false} className="btn btn-secondary btn-fluid">
                <span>Find in a boutique</span>
                <ArrowIcon />
              </Link>
            </div>

            <p className="type-body">{product.description}</p>

            <div>
              <details className="divider group" open>
                <summary className="type-title-xs flex cursor-pointer list-none justify-between py-4 [&::-webkit-details-marker]:hidden">
                  Details
                  <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="type-body-sm stack pb-6 [--stack-gap:0.375rem]">
                  {product.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>
              <details className="divider group">
                <summary className="type-title-xs flex cursor-pointer list-none justify-between py-4 [&::-webkit-details-marker]:hidden">
                  Care
                  <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="type-body-sm pb-6">{product.care}</p>
              </details>
              <details className="divider group border-b border-line">
                <summary className="type-title-xs flex cursor-pointer list-none justify-between py-4 [&::-webkit-details-marker]:hidden">
                  Delivery and returns
                  <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="type-body-sm pb-6">
                  Complimentary express delivery with signature on arrival. Returns are free
                  within 30 days, from home or in a boutique.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <section className="container-page section" aria-labelledby="related-title">
        <h2 id="related-title" className="type-title-lg mb-6 lg:mb-8">
          You may also like
        </h2>
        <div className="product-grid">
          {related.map((item, index) => (
            <ProductCard
              key={item.slug}
              product={item}
              sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
              className={index >= 3 ? "md:max-lg:hidden" : ""}
            />
          ))}
        </div>
      </section>
    </>
  );
}
