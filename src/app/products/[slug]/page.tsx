import Image from "next/image";
import { getProductBySlug } from "@/app/db/repositories/ProductsRepository";
import Link from "next/link";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <p>Product not found.</p>
        <Link href="/" className="text-sm underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
        {product.image_url && (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{product.name}</h1>
          <p className="mt-1 text-base text-zinc-600">{product.description}</p>
        </div>
        <div className="text-xl font-medium">{(product.price_cents/100).toLocaleString(undefined,{ style: 'currency', currency: product.currency || 'USD'})}</div>
        <form action="/cart" method="GET" className="flex flex-col gap-4">
          {product.sizes?.length ? (
            <label className="text-sm">Size
              <select name="size" className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">
                {product.sizes.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </label>
          ) : null}
          {product.colors?.length ? (
            <label className="text-sm">Color
              <select name="color" className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm">
                {product.colors.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </label>
          ) : null}
          <input type="hidden" name="slug" value={product.slug} />
          <input type="hidden" name="name" value={product.name} />
          <input type="hidden" name="price_cents" value={product.price_cents} />
          <input type="hidden" name="product_id" value={product.id} />
          <button className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800">Add to cart</button>
        </form>
        <Link href="/" className="text-sm underline">Continue shopping</Link>
      </div>
    </div>
  );
}
