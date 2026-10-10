import "server-only";

import { asc, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "./index";
import { categories, products, stock } from "./schema";

// Catalogue reads for the storefront. Every function is cached and tagged
// "catalogue"; revalidate that tag after writing to these tables.

const summaryFields = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  category: categories.name,
  priceCents: products.priceCents,
  image: products.image,
  imageAlt: products.imageAlt,
  isNew: products.isNew,
  /** Units available, summed across sizes. */
  stock: sql<number>`coalesce(sum(${stock.quantity}), 0)::int`,
};

function selectSummaries() {
  return db
    .select(summaryFields)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stock, eq(stock.productId, products.id))
    .groupBy(products.id, categories.id);
}

export type ProductSummary = Awaited<ReturnType<typeof selectSummaries>>[number];

export type ProductDetail = NonNullable<Awaited<ReturnType<typeof getProduct>>>;

/** Categories shown in the home page collections rail. */
export async function getCollections() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const rows = await db
    .select()
    .from(categories)
    .where(isNotNull(categories.image))
    .orderBy(asc(categories.position), asc(categories.id));

  return rows.flatMap(({ image, imageAlt, ...category }) =>
    image === null ? [] : [{ ...category, image, imageAlt: imageAlt ?? "" }],
  );
}

/** Category links for the header menu and the footer. */
export async function getNavigation() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const rows = await db
    .select({ slug: categories.slug, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.position), asc(categories.id));

  return rows.map((row) => ({ label: row.name, href: `/collections/${row.slug}` }));
}

export async function getNewArrivals(): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  return selectSummaries().orderBy(asc(products.id));
}

export async function getProductSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const rows = await db.select({ slug: products.slug }).from(products);
  return rows.map((row) => row.slug);
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  const row = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    columns: { createdAt: false },
    with: {
      category: { columns: { slug: true, name: true } },
      stock: {
        columns: { size: true, quantity: true },
        orderBy: [asc(stock.position), asc(stock.id)],
      },
    },
  });
  if (!row) return null;

  const { stock: rows, ...product } = row;
  const sizes = rows.flatMap((entry) =>
    entry.size === null ? [] : [{ label: entry.size, stock: entry.quantity }],
  );

  return {
    ...product,
    /** Per-size availability, or null for a product that is not sized. */
    sizes: sizes.length > 0 ? sizes : null,
    /** Units available, summed across sizes. */
    stock: rows.reduce((sum, entry) => sum + entry.quantity, 0),
  };
}

/** Other products to show beside one, same category first. */
export async function getRelated(
  productId: number,
  categoryId: number,
  count = 4,
): Promise<ProductSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalogue");

  return selectSummaries()
    .where(ne(products.id, productId))
    .orderBy(desc(eq(products.categoryId, categoryId)), asc(products.id))
    .limit(count);
}
