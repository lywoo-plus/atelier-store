import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ProductListing } from "@/components/product-listing";
import { brand, hero } from "@/data/storefront";
import { getCollection, getCollectionSlugs } from "@/db/queries";

export async function generateStaticParams() {
  const slugs = await getCollectionSlugs();
  // /collections/new is its own route: the latest pieces across every category.
  return slugs.filter((slug) => slug !== "new").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return {};
  return {
    title: `${collection.name} | ${brand.name}`,
    description: collection.tagline ?? undefined,
  };
}

export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <main className="flex-1">
      {/* The slug is read inside the boundary so the route keeps a URL-independent shell. */}
      <Suspense fallback={<div aria-busy="true" className="section" />}>
        <CollectionContent params={params} />
      </Suspense>
    </main>
  );
}

async function CollectionContent({ params }: Pick<PageProps<"/collections/[slug]">, "params">) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  return (
    <ProductListing
      kicker={hero.kicker}
      title={collection.name}
      description={collection.tagline}
      products={collection.products}
      emptyMessage="This collection is being prepared. The first pieces are on their way."
    />
  );
}
