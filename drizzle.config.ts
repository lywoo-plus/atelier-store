import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Same files Next reads; .env.local wins when both define a variable.
config({ path: [".env.local", ".env"] });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
