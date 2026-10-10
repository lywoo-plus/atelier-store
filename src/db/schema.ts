import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export type ProductImage = { src: string; alt: string };

export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  /** Categories with an image are shown in the home page collections rail. */
  image: text("image"),
  imageAlt: text("image_alt"),
  position: integer("position").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    slug: text("slug").notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    colour: text("colour").notNull(),
    description: text("description").notNull(),
    care: text("care").notNull(),
    priceCents: integer("price_cents").notNull(),
    /** Listing image; the gallery holds the product page frames. */
    image: text("image").notNull(),
    imageAlt: text("image_alt").notNull(),
    gallery: jsonb("gallery").$type<ProductImage[]>().notNull(),
    details: text("details").array().notNull(),
    isNew: boolean("is_new").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("products_category_id_idx").on(table.categoryId)],
);

export const stock = pgTable(
  "stock",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Size label, or null for a product that is not sized (one row). */
    size: text("size"),
    quantity: integer("quantity").notNull().default(0),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    unique("stock_product_id_size_unique").on(table.productId, table.size).nullsNotDistinct(),
    check("stock_quantity_non_negative", sql`${table.quantity} >= 0`),
  ],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  stock: many(stock),
}));

export const stockRelations = relations(stock, ({ one }) => ({
  product: one(products, {
    fields: [stock.productId],
    references: [products.id],
  }),
}));
