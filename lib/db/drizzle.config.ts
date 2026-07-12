import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  // Relative, forward-slash path. drizzle-kit resolves this relative to
  // this config file. Using path.join(__dirname, ...) breaks on Windows
  // because it produces backslash paths, which drizzle-kit's internal
  // glob matcher (fast-glob) cannot match, causing a false
  // "No schema files found" error.
  schema: "./src/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
