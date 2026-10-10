// Editorial content for the storefront, plus display helpers. The catalogue
// (categories, products, stock) is read from the database in src/db/queries.ts.

export type NavItem = { label: string; href: string };

export type StockState = {
  status: "in-stock" | "low-stock" | "sold-out";
  label: string;
};

export type Story = {
  kicker: string;
  title: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

/** Unsplash source URL; next/image resizes from this. */
function photo(id: string, width = 1600) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
}

export const brand = { name: "Atelier" };

export const hero = {
  kicker: "Autumn Winter 2026",
  title: ["The Quiet", "Hour"],
  image: photo("1593528625646-d705402054ba", 2400),
  imageAlt:
    "A woman in a star-print dress reclining across two wooden chairs, long shadows falling over a concrete floor",
  actions: [
    { label: "Shop women", href: "/collections/women" },
    { label: "Shop men", href: "/collections/men" },
  ],
};

const LOW_STOCK = 3;

export function getStockState(stock: number): StockState {
  if (stock <= 0) return { status: "sold-out", label: "Sold out" };
  if (stock <= LOW_STOCK) return { status: "low-stock", label: `Only ${stock} left` };
  return { status: "in-stock", label: "In stock" };
}

export const feature = {
  kicker: "The Leather Edit",
  title: "Made to be worn in",
  body: "Jackets, bags and boots cut from full-grain hides and finished by hand. Each piece is left unlined where it can be, so the leather softens and darkens with the person who wears it.",
  href: "/collections/leather",
  cta: "Explore the edit",
  image: photo("1602346693719-c1c05078679e"),
  imageAlt: "A man in a brown leather jacket seen in profile",
};

export const stories: Story[] = [
  {
    kicker: "Eveningwear",
    title: "After dark",
    href: "/collections/evening",
    cta: "Shop evening",
    image: photo("1664076458686-3449062080ac"),
    imageAlt: "A woman in a satin slip dress, long gloves and sunglasses",
  },
  {
    kicker: "Tailoring",
    title: "The new suit",
    href: "/collections/tailoring",
    cta: "Shop tailoring",
    image: photo("1766103809717-f57039c6d0ce"),
    imageAlt: "Black and white portrait of a man seated on a chair in a studio",
  },
];

export const services = [
  {
    title: "Complimentary delivery",
    body: "Express shipping on every order, with signature on arrival.",
  },
  {
    title: "Returns within 30 days",
    body: "Send it back from home or return it in store, free of charge.",
  },
  {
    title: "Private appointments",
    body: "Reserve time with an advisor, in the boutique or by video.",
  },
];

/** Static footer columns; the footer adds a "Shop" column from the categories table. */
export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Client services",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Delivery", href: "/delivery" },
      { label: "Returns", href: "/returns" },
      { label: "Book an appointment", href: "/appointments" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Craft", href: "/craft" },
      { label: "Boutiques", href: "/boutiques" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Formats a price held in cents. */
export function formatPrice(cents: number) {
  return usd.format(cents / 100);
}
