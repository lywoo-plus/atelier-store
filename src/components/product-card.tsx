import Image from "next/image";
import Link from "next/link";

import { formatPrice, getStockState } from "@/data/storefront";
import type { ProductSummary } from "@/db/queries";

export function ProductCard({
  product,
  sizes,
  className = "",
  preload = false,
}: {
  product: ProductSummary;
  /** `sizes` hint for the image, matching the grid the card sits in. */
  sizes: string;
  className?: string;
  /** Preload the image; for cards above the fold. */
  preload?: boolean;
}) {
  const soldOut = getStockState(product.stock).status === "sold-out";
  const badge = soldOut ? "Sold out" : product.isNew ? "New" : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      prefetch={false}
      className={`product-card group ${className}`}
    >
      <div className="media media-square media-zoom">
        <Image src={product.image} alt={product.imageAlt} fill sizes={sizes} preload={preload} />
        {badge && (
          <span className="type-caption absolute top-2 left-2 bg-background px-1.5 py-1 text-foreground uppercase">{badge}</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="type-label">{product.name}</h3>
        <p className="type-body-sm text-muted">{product.category}</p>
        <p className={`type-label ${soldOut ? "text-muted" : ""}`}>{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
