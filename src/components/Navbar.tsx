"use client";

import Link from "next/link";

export function Navbar() {

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm font-semibold tracking-tight text-zinc-900"
            >
              My Store
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}


