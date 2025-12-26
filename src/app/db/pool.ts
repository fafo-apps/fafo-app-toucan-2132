import { Pool } from "pg";

const connectionString = process.env.SUPABASE_DB_URL;
const schema = process.env.SUPABASE_SCHEMA || "public";

if (!connectionString) {
  console.warn("SUPABASE_DB_URL is not set. Database features will be disabled.");
}

export const pool = connectionString
  ? new Pool({ connectionString, application_name: "aesthetic-shop" })
  : (null as unknown as Pool);

export async function withSchema<T>(sql: string): Promise<string> {
  // Helper to prefix the schema for tables if SUPABASE_SCHEMA provided
  const s = schema;
  if (!s || s === "public") return sql;
  return sql.replaceAll(" products ", ` ${s}.products `)
            .replaceAll(" orders ", ` ${s}.orders `)
            .replaceAll(" order_items ", ` ${s}.order_items `)
            .replaceAll(" from products", ` from ${s}.products`)
            .replaceAll(" from orders", ` from ${s}.orders`)
            .replaceAll(" from order_items", ` from ${s}.order_items`)
            .replaceAll(" into products", ` into ${s}.products`)
            .replaceAll(" into orders", ` into ${s}.orders`)
            .replaceAll(" into order_items", ` into ${s}.order_items`)
            .replaceAll(" update products", ` update ${s}.products`)
            .replaceAll(" update orders", ` update ${s}.orders`)
            .replaceAll(" update order_items", ` update ${s}.order_items`);
}
