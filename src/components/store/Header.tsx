"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { HeaderConfig, SiteSettings } from "@/lib/types";

export function SiteHeader({
  settings,
  header,
}: {
  settings: SiteSettings;
  header: HeaderConfig;
}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  return (
    <header className="relative z-40">
      {settings.announcement ? (
        <div className="bg-ink text-center text-xs font-medium tracking-wide text-white/90 sm:text-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-2">
            <span>{settings.announcement}</span>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-1 text-volt-bright sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5" />
              {settings.phone}
            </a>
          </div>
        </div>
      ) : null}

      <div className="glass sticky top-0 border-b border-white/50 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:py-4">
          <button
            type="button"
            className="rounded-lg p-2 text-ink lg:hidden"
            aria-label="Меню"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="group shrink-0">
            <span className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Domo<span className="text-volt">Volt</span>
            </span>
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-ink-muted sm:text-[11px]">
              {settings.tagline}
            </span>
          </Link>

          {header.showSearch ? (
            <form
              action="/search"
              className="relative mx-auto hidden max-w-xl flex-1 md:block"
            >
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                name="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Търсене на продукти..."
                className="w-full rounded-xl border border-ink/10 bg-white/80 py-2.5 pl-10 pr-4 text-sm outline-none ring-volt/30 transition focus:ring-2"
              />
            </form>
          ) : null}

          <div className="ml-auto flex items-center gap-2">
            {header.showCart ? (
              <Link
                href="/cart"
                className="relative inline-flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Количка</span>
                {count > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                    {count}
                  </span>
                ) : null}
              </Link>
            ) : null}
          </div>
        </div>

        <nav className="hidden border-t border-ink/5 lg:block">
          <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2">
            {header.mainMenu.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-ink/80 transition hover:bg-volt/10 hover:text-volt"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="ml-auto flex gap-3 text-xs text-ink-muted">
              {header.topBarLinks.map((l) => (
                <Link key={l.id} href={l.href} className="hover:text-volt">
                  {l.label}
                </Link>
              ))}
            </li>
          </ul>
        </nav>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Затвори"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-white shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <span className="font-display text-xl font-bold">
                Domo<span className="text-volt">Volt</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} aria-label="Затвори">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form action="/search" className="border-b p-4">
              <input
                name="q"
                placeholder="Търсене..."
                className="w-full rounded-xl border border-ink/10 px-3 py-2.5 text-sm"
              />
            </form>
            <ul className="flex-1 space-y-1 overflow-y-auto p-3">
              {header.mainMenu.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-sand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
