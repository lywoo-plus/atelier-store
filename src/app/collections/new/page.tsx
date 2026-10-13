import type { Metadata } from "next";

import { ProductListing } from "@/components/product-listing";
import { brand, hero } from "@/data/storefront";
import { getLatestProducts } from "@/db/queries";

export const metadata: Metadata = {
  title: `New arrivals | ${brand.name}`,
  description: "The latest pieces to arrive at the atelier.",
};

export default async function NewArrivalsPage() {
  const products = await getLatestProducts();

  return (
    <main className="flex-1">
      <ProductListing
        kicker={hero.kicker}
        title="New arrivals"
        products={products}
        emptyMessage="Nothing new just yet. The next pieces are on their way."
      />
    </main>
  );
}
