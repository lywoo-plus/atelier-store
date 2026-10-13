import { ProductCard } from "@/components/product-card";
import type { ProductSummary } from "@/db/queries";

/** Listing page body: a titled header with the piece count over the product grid. */
export function ProductListing({
  kicker,
  title,
  description,
  products,
  emptyMessage,
}: {
  kicker: string;
  title: string;
  description?: string | null;
  products: ProductSummary[];
  /** Shown in place of the grid when there are no products. */
  emptyMessage: string;
}) {
  return (
    <section className="container-page section-tight pb-section" aria-labelledby="listing-title">
      <header className="mb-6 flex items-end justify-between gap-4 lg:mb-8">
        <div>
          <p className="type-title-xs mb-3 text-muted">{kicker}</p>
          <h1 id="listing-title" className="type-title-xl">
            {title}
          </h1>
          {description && <p className="type-body mt-3 text-muted">{description}</p>}
        </div>
        <p className="type-body-sm text-muted">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>
      </header>

      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.slug}
              product={product}
              sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
              // The first row is above the fold at every breakpoint.
              preload={index < 4}
            />
          ))}
        </div>
      ) : (
        <p className="type-body divider py-10 text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}
