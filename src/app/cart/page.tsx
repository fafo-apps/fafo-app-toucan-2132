"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function price(n: number, currency = 'USD') {
  try { return (n/100).toLocaleString(undefined, { style: 'currency', currency }); } catch { return `$${(n/100).toFixed(2)}`; }
}

type CartItem = {
  product_id: number;
  name: string;
  slug: string;
  unit_price_cents: number;
  quantity: number;
  size?: string;
  color?: string;
};

function CartInner() {
  const params = useSearchParams();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  });

  useEffect(() => {
    const slug = params.get('slug');
    if (!slug) return;
    const size = params.get('size') || undefined;
    const color = params.get('color') || undefined;
    const name = params.get('name') || slug;
    const priceCents = Number(params.get('price_cents') || 0);
    const id = Number(params.get('product_id') || 0);

    if (id && priceCents) {
      setItems((prev) => {
        const idx = prev.findIndex(p => p.slug === slug && p.size === size && p.color === color);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          localStorage.setItem('cart', JSON.stringify(next));
          return next;
        }
        const next = [...prev, { product_id: id, name, slug, unit_price_cents: priceCents, quantity: 1, size, color }];
        localStorage.setItem('cart', JSON.stringify(next));
        return next;
      });
    }
  }, [params]);

  const total = useMemo(() => items.reduce((s, it) => s + it.unit_price_cents * it.quantity, 0), [items]);

  const updateQty = (slug: string, size?: string, color?: string, delta = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex(p => p.slug === slug && p.size === size && p.color === color);
      if (idx < 0) return prev;
      const next = [...prev];
      const q = Math.max(0, next[idx].quantity + delta);
      if (q === 0) next.splice(idx, 1); else next[idx] = { ...next[idx], quantity: q };
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };

  const checkout = async () => {
    if (!items.length) return;
    const email = prompt('Enter your email for the order receipt:') || '';
    const full_name = prompt('Enter your name (optional):') || undefined;
    if (!email) return;
    const res = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, full_name, currency: 'USD', items }) });
    const data = await res.json();
    if (data?.ok) {
      alert('Order placed! #' + data.order.id);
      localStorage.removeItem('cart');
      setItems([]);
    } else {
      alert('Something went wrong.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {!items.length ? (
        <p className="text-zinc-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map((it) => (
            <div key={`${it.slug}-${it.size}-${it.color}`} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-zinc-600">{[it.size, it.color].filter(Boolean).join(' / ')}</div>
                <div className="text-sm">{price(it.unit_price_cents)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-8 w-8 rounded-full border" onClick={() => updateQty(it.slug, it.size, it.color, -1)}>-</button>
                <div className="w-8 text-center">{it.quantity}</div>
                <button className="h-8 w-8 rounded-full border" onClick={() => updateQty(it.slug, it.size, it.color, 1)}>+</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="text-lg font-medium">Total</div>
            <div className="text-lg font-semibold">{price(total)}</div>
          </div>
          <div className="flex justify-end">
            <button onClick={checkout} className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10">Loading cart…</div>}>
      <CartInner />
    </Suspense>
  );
}
