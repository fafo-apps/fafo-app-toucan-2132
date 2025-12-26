import Link from "next/link";
import Image from "next/image";
import { listProducts } from "@/app/db/repositories/ProductsRepository";

export default async function Home() {
  const products = await listProducts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 rounded-2xl bg-zinc-100 p-10 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Aesthetic essentials for an effortless wardrobe</h1>
        <p className="mt-2 text-zinc-600">Minimal silhouettes. Elevated comfort. Intentional details.</p>
      </section>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id} className="group overflow-hidden rounded-xl border">
            <Link href={`/products/${p.slug}`} className="block">
              <div className="relative aspect-square bg-zinc-100">
                {p.image_url && (
                  <Image src={p.image_url} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-zinc-900">{p.name}</h3>
                  <span className="text-sm text-zinc-700">{(p.price_cents/100).toLocaleString(undefined,{ style: 'currency', currency: p.currency || 'USD'})}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{p.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
