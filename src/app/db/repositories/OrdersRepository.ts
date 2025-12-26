import { pool, withSchema } from "@/app/db/pool";

export type OrderItemInput = {
  product_id: number;
  quantity: number;
  unit_price_cents: number;
  size?: string;
  color?: string;
};

export type CreateOrderInput = {
  email: string;
  full_name?: string;
  currency: string;
  items: OrderItemInput[];
};

export async function createOrder(input: CreateOrderInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const ordersSql = await withSchema(
      `insert into orders (email, full_name, status, total_cents, currency) values ($1, $2, 'pending', $3, $4) returning id`
    );

    const total = input.items.reduce((sum, it) => sum + it.unit_price_cents * it.quantity, 0);
    const orderRes = await client.query({ text: ordersSql, values: [input.email, input.full_name ?? null, total, input.currency] });
    const orderId = orderRes.rows[0].id as number;

    const itemsSql = await withSchema(
      `insert into order_items (order_id, product_id, quantity, unit_price_cents, size, color) values ($1, $2, $3, $4, $5, $6)`
    );

    for (const it of input.items) {
      await client.query({
        text: itemsSql,
        values: [orderId, it.product_id, it.quantity, it.unit_price_cents, it.size ?? null, it.color ?? null],
      });
    }

    await client.query("COMMIT");
    return { id: orderId, total_cents: total };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
