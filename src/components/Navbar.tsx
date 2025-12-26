"use client";

import Link from "next/link";

export function Navbar() {

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-zinc-900"
            >
              Your Brand
            </Link>
          </div>
          <div>
            <Link href="/cart" className="text-sm text-zinc-700 hover:text-zinc-900">Cart</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
