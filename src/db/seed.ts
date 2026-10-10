// Sample catalogue with Unsplash imagery. Run with `pnpm db:seed`; it replaces
// everything in the categories, products and stock tables.

import { db } from "./index";
import { categories, products, stock, type ProductImage } from "./schema";

/** Unsplash source URL; next/image resizes from this. */
function photo(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/** A tighter crop of the same photograph, used as a detail frame. */
function detail(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.55&fp-z=1.8&w=${width}&h=${Math.round(width * 0.75)}&q=80`;
}

type StockSeed = { size: string | null; quantity: number };

/** A single stock row for a product that is not sized. */
function units(quantity: number): StockSeed[] {
  return [{ size: null, quantity }];
}

/** EU sizes 39-45 with the given units per size. */
function sizes(...quantities: number[]): StockSeed[] {
  return quantities.map((quantity, index) => ({ size: String(39 + index), quantity }));
}

const bagCare =
  "Keep away from rain and direct heat. Wipe with a dry cloth and store in the dust bag provided.";
const shoeCare =
  "Rest on shoe trees between wears. Brush off dust and condition the leather every few months.";

const categorySeed: (typeof categories.$inferInsert)[] = [
  {
    slug: "women",
    name: "Women",
    tagline: "Outerwear and tailoring",
    image: photo("1613915617430-8ab0fd7c6baf"),
    imageAlt: "A person in an oversized blazer and trousers, hand in pocket",
  },
  {
    slug: "men",
    name: "Men",
    tagline: "Coats for the season",
    image: photo("1619603364904-c0498317e145"),
    imageAlt: "A man in a long camel coat over a roll-neck",
  },
  {
    slug: "bags",
    name: "Bags",
    tagline: "Vegetable-tanned leather",
    image: photo("1624687943971-e86af76d57de"),
    imageAlt: "A tan leather tote hanging against a white door",
  },
  // No image: linked from the navigation but not shown in the collections rail.
  { slug: "shoes", name: "Shoes" },
  {
    slug: "jewellery",
    name: "Jewellery",
    tagline: "Gold and stone",
    image: photo("1652766540048-de0a878a3266"),
    imageAlt: "Close view of a beaded hoop earring",
  },
];

type ProductSeed = {
  slug: string;
  name: string;
  categorySlug: string;
  /** Whole US dollars; stored as cents. */
  price: number;
  colour: string;
  image: string;
  imageAlt: string;
  gallery: ProductImage[];
  description: string;
  details: string[];
  care: string;
  stock: StockSeed[];
  isNew?: boolean;
};

const productSeed: ProductSeed[] = [
  {
    slug: "structured-leather-satchel",
    name: "Structured Leather Satchel",
    categorySlug: "bags",
    price: 1950,
    colour: "Cognac",
    image: photo("1691480150204-66dd1eb77391", 1200),
    imageAlt: "Cognac leather satchel with twin buckles",
    gallery: [
      { src: photo("1691480150204-66dd1eb77391"), alt: "Cognac leather satchel with twin buckles, front view" },
      { src: photo("1637759292654-a12cb2be085e"), alt: "Close view of the polished leather and stitching" },
    ],
    description:
      "A structured satchel in polished full-grain leather, built around a rigid frame so it keeps its shape when set down. Two rolled handles and a detachable shoulder strap.",
    details: [
      "Full-grain calf leather",
      "Twin buckle closure with hidden magnetic snaps",
      "Detachable, adjustable shoulder strap",
      "One zipped and two open interior pockets",
      "38 x 27 x 14 cm",
    ],
    care: bagCare,
    stock: units(12),
    isNew: true,
  },
  {
    slug: "brogue-lace-up-boot",
    name: "Brogue Lace-Up Boot",
    categorySlug: "shoes",
    price: 890,
    colour: "Tan",
    image: photo("1638609348722-aa2a3a67db26", 1200),
    imageAlt: "Pair of tan brogue boots",
    gallery: [
      { src: photo("1638609348722-aa2a3a67db26"), alt: "Pair of tan brogue boots" },
      { src: detail("1638609348722-aa2a3a67db26"), alt: "Detail of the broguing on the toe cap" },
    ],
    description:
      "A wingtip boot on a storm-welted leather sole, punched and pinked by hand. The burnished toe deepens with every polish.",
    details: [
      "Burnished calf leather upper",
      "Goodyear-welted leather sole",
      "Leather lining and insole",
      "Seven-eyelet lacing",
    ],
    care: shoeCare,
    stock: sizes(0, 0, 1, 0, 1, 0, 0),
    isNew: true,
  },
  {
    slug: "mini-top-handle-bag",
    name: "Mini Top Handle Bag",
    categorySlug: "bags",
    price: 1450,
    colour: "Saffron",
    image: photo("1640901555383-7335ec5a6476", 1200),
    imageAlt: "Small yellow leather top handle bag",
    gallery: [
      { src: photo("1640901555383-7335ec5a6476"), alt: "Small yellow leather top handle bag" },
      { src: detail("1640901555383-7335ec5a6476"), alt: "Detail of the clasp" },
    ],
    description:
      "A compact top-handle bag in smooth calf leather with a turn-lock clasp. Carried by hand or worn across the body on its slim strap.",
    details: [
      "Smooth calf leather",
      "Turn-lock clasp",
      "Detachable cross-body strap",
      "Suede lining",
      "20 x 16 x 9 cm",
    ],
    care: bagCare,
    stock: units(8),
  },
  {
    slug: "wingtip-derby",
    name: "Wingtip Derby",
    categorySlug: "shoes",
    price: 780,
    colour: "Oxblood",
    image: photo("1641893843833-a006778dc00b", 1200),
    imageAlt: "Pair of dark oxblood wingtip derby shoes",
    gallery: [
      { src: photo("1641893843833-a006778dc00b"), alt: "Pair of dark oxblood wingtip derby shoes" },
      { src: detail("1641893843833-a006778dc00b"), alt: "Detail of the perforated toe cap" },
    ],
    description:
      "A derby with a full wingtip, cut from museum calf and finished with a deep hand-applied polish.",
    details: [
      "Museum calf leather upper",
      "Blake-stitched leather sole",
      "Leather lining and insole",
      "Five-eyelet open lacing",
    ],
    care: shoeCare,
    stock: sizes(0, 0, 0, 0, 0, 0, 0),
  },
  {
    slug: "buckle-flap-satchel",
    name: "Buckle Flap Satchel",
    categorySlug: "bags",
    price: 1690,
    colour: "Slate",
    image: photo("1605733513597-a8f8341084e6", 1200),
    imageAlt: "Grey leather satchel with brass buckles",
    gallery: [
      { src: photo("1605733513597-a8f8341084e6"), alt: "Grey leather satchel with brass buckles" },
      { src: detail("1605733513597-a8f8341084e6"), alt: "Detail of the buckles and grained leather" },
    ],
    description:
      "A school satchel redrawn in grained leather, with a full flap, brass buckles and a single top handle.",
    details: [
      "Grained calf leather",
      "Brass buckle closures",
      "Single top handle",
      "Fits a 13-inch laptop",
      "34 x 24 x 10 cm",
    ],
    care: bagCare,
    stock: units(5),
    isNew: true,
  },
  {
    slug: "zip-ankle-boot",
    name: "Zip Ankle Boot",
    categorySlug: "shoes",
    price: 840,
    colour: "Black",
    image: photo("1605732440685-d0654d81aa30", 1200),
    imageAlt: "Black leather ankle boot with a side zip",
    gallery: [
      { src: photo("1605732440685-d0654d81aa30"), alt: "Black leather ankle boot with a side zip" },
      { src: detail("1605732440685-d0654d81aa30"), alt: "Detail of the side zip" },
    ],
    description:
      "A clean ankle boot with an exposed side zip and a low stacked heel. Cut close to the ankle to sit under a narrow trouser.",
    details: [
      "Smooth calf leather upper",
      "Stacked leather heel, 30 mm",
      "Exposed metal side zip",
      "Leather sole with rubber insert",
    ],
    care: shoeCare,
    stock: sizes(1, 2, 0, 2, 1, 0, 0),
  },
  {
    slug: "leather-bowling-bag",
    name: "Leather Bowling Bag",
    categorySlug: "bags",
    price: 2100,
    colour: "Black",
    image: photo("1705909237050-7a7625b47fac", 1200),
    imageAlt: "Black leather bowling bag",
    gallery: [
      { src: photo("1705909237050-7a7625b47fac"), alt: "Black leather bowling bag" },
      { src: detail("1705909237050-7a7625b47fac"), alt: "Detail of the handles and buckled straps" },
    ],
    description:
      "A rounded bowling bag in pebbled leather with two buckled straps and a wide zip opening.",
    details: [
      "Pebbled calf leather",
      "Two-way zip with buckled straps",
      "Twin rolled handles",
      "Cotton twill lining",
      "32 x 22 x 18 cm",
    ],
    care: bagCare,
    stock: units(1),
  },
  {
    slug: "suede-chelsea-boot",
    name: "Suede Chelsea Boot",
    categorySlug: "shoes",
    price: 720,
    colour: "Tobacco",
    image: photo("1605733160314-4fc7dac4bb16", 1200),
    imageAlt: "Pair of tan suede Chelsea boots",
    gallery: [
      { src: photo("1605733160314-4fc7dac4bb16"), alt: "Pair of tan suede Chelsea boots" },
      { src: detail("1605733160314-4fc7dac4bb16"), alt: "Detail of the suede and side strap" },
    ],
    description:
      "A Chelsea boot in brushed suede with a buckled side strap and a flexible rubber sole.",
    details: [
      "Brushed calf suede upper",
      "Buckled side strap",
      "Leather lining",
      "Lightweight rubber sole",
    ],
    care: shoeCare,
    stock: sizes(0, 2, 3, 2, 1, 1, 0),
  },
];

async function seed() {
  // Products cascade to stock; categories are restricted, so they go last.
  await db.batch([db.delete(products), db.delete(categories)]);

  const insertedCategories = await db
    .insert(categories)
    .values(categorySeed.map((category, position) => ({ ...category, position })))
    .returning({ id: categories.id, slug: categories.slug });
  const categoryIds = new Map(insertedCategories.map((row) => [row.slug, row.id]));

  // One multi-row insert keeps identity ids in array order, which is the
  // order the home page lists products in.
  const insertedProducts = await db
    .insert(products)
    .values(
      productSeed.map((product) => {
        const categoryId = categoryIds.get(product.categorySlug);
        if (categoryId === undefined) throw new Error(`Unknown category: ${product.categorySlug}`);
        return {
          slug: product.slug,
          categoryId,
          name: product.name,
          colour: product.colour,
          description: product.description,
          care: product.care,
          priceCents: product.price * 100,
          image: product.image,
          imageAlt: product.imageAlt,
          gallery: product.gallery,
          details: product.details,
          isNew: product.isNew ?? false,
        };
      }),
    )
    .returning({ id: products.id, slug: products.slug });
  const productIds = new Map(insertedProducts.map((row) => [row.slug, row.id]));

  const stockRows = productSeed.flatMap((product) =>
    product.stock.map((entry, position) => ({
      productId: productIds.get(product.slug)!,
      size: entry.size,
      quantity: entry.quantity,
      position,
    })),
  );
  await db.insert(stock).values(stockRows);

  console.log(
    `Seeded ${insertedCategories.length} categories, ${insertedProducts.length} products, ${stockRows.length} stock rows.`,
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
