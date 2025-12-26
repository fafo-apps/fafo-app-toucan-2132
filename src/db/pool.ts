import { Pool } from "pg";

declare global {
  var _pool: Pool | undefined;
}

if (!global._pool) {
  const connectionString = process.env.SUPABASE_DB_URL;
  const schema = process.env.SUPABASE_SCHEMA;

  if (!connectionString) {
    throw new Error("Missing SUPABASE_DB_URL (must be set in Vercel env vars)");
  }

  global._pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    ssl: {
      rejectUnauthorized: false
    }
  });

  global._pool.on('connect', (client) => {
    client.query(`SET search_path TO ${schema}, public;`).catch(console.error);
  });
}

export const pool = global._pool;