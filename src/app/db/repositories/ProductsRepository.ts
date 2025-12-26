import { pool, withSchema } from "@/app/db/pool";

export type Product = {
  id: number;
  name: string;
  slug: string;
  price_cents: number;
  currency: string;
  image_url: string | null;
  description: string | null;
  sizes: string[] | null;
  colors: string[] | null;
  created_at: string;
};

export async function listProducts(): Promise<Product[]> {
  const sql = await withSchema(`select id, name, slug, price_cents, currency, image_url, description, sizes, colors, created_at from products order by created_at desc`);
  const res = await pool.query(sql);
  return res.rows;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const sql = await withSchema(`select id, name, slug, price_cents, currency, image_url, description, sizes, colors, created_at from products where slug = $1 limit 1`);
  const res = await pool.query({ text: sql, values: [slug] });
  return res.rows[0] ?? null;
}
