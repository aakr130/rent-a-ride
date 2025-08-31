import { Pool } from "pg";

// Debug logging for database connection
console.log("🔍 DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("🔍 DATABASE_URL starts with:", process.env.DATABASE_URL?.substring(0, 20) + "...");

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test the connection
db.on('connect', () => {
  console.log("✅ Database connected successfully");
});

db.on('error', (err) => {
  console.error("❌ Database connection error:", err.message);
});
