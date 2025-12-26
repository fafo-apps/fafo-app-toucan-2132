import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/app/db/repositories/OrdersRepository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, full_name, currency, items } = body ?? {};

    if (!email || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }

    const order = await createOrder({ email, full_name, currency: currency || 'USD', items });
    return NextResponse.json({ ok: true, order });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
