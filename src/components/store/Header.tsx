"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Menu,
  Search,
  ShoppingBag,
  X,
  Phone,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CategoryRow, HeaderConfig, SiteSettings } from "@/lib/types";

export function SiteHeader({
  settings,
  header,
  categories,
}: {
  settings: SiteSettings;
  header: HeaderConfig;
  categories: CategoryRow[];
}) {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [q, setQ] = useState("");
  const categoryListRef = useRef<HTMLDivElement>(null);
  const topCategories = categories.filter((category) => category.parent_id === 0);
  const descendantsOf = (parentId: number, depth = 0): Array<{ category: CategoryRow; depth: number }> => {
    const result: Array<{ category: CategoryRow; depth: number }> = [];
    const children = categories
      .filter((category) => category.parent_id === parentId)
      .sort((a, b) => a.sort_order - b.sort_order);

    for (const child of children) {
      if (child.count > 0) result.push({ category: child, depth });
      result.push(...descendantsOf(child.id, depth + 1));
    }
    return result;
  };

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
            className="rounded-lg p-2 text-ink xl:hidden"
            aria-label="Меню"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="group shrink-0">
            <span className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Texno<span className="text-volt">House</span>
            </span>
            <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-ink-muted sm:text-[11px]">
              {settings.tagline}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setCategoriesOpen(true)}
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-rose-500 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-accent/30 transition hover:scale-[1.03] hover:from-rose-500 hover:to-accent active:scale-[0.98] sm:inline-flex xl:hidden"
            aria-label="Категории"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden lg:inline">Категории</span>
          </button>

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

        <nav className="hidden border-t border-ink/5 xl:block">
          <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2">
            <li>
              <button
                type="button"
                onClick={() => setCategoriesOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-rose-500 px-3 py-2 text-sm font-bold text-white shadow-md shadow-accent/25 transition hover:scale-[1.03] hover:from-rose-500 hover:to-accent active:scale-[0.98]"
              >
                <Menu className="h-4 w-4" />
                Категории
              </button>
            </li>
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
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Затвори"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-white shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between border-b px-4 py-4">
              <span className="font-display text-xl font-bold">
                Texno<span className="text-volt">House</span>
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
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setCategoriesOpen(true);
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-accent to-rose-500 px-3 py-3 text-left text-base font-bold text-white shadow-lg shadow-accent/30"
                >
                  <span className="flex items-center gap-2"><Menu className="h-4 w-4" /> Категории</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </li>
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

      {categoriesOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50"
            aria-label="Затвори категориите"
            onClick={() => setCategoriesOpen(false)}
          />
          <aside className="absolute inset-0 flex h-full w-full flex-col bg-sand-warm shadow-2xl animate-fadeUp">
            <div className="flex items-center justify-between border-b border-ink/10 bg-white px-5 py-4 sm:px-8">
              <div className="mx-auto w-full max-w-5xl">
                <p className="font-display text-2xl font-bold text-ink">Категории</p>
                <p className="text-sm text-ink-muted">Разгледай всички продукти</p>
              </div>
              <button type="button" onClick={() => setCategoriesOpen(false)} aria-label="Затвори">
                <X className="h-6 w-6 text-ink" />
              </button>
            </div>
            <div ref={categoryListRef} className="flex-1 overflow-y-auto scroll-smooth">
              <div className="mx-auto max-w-7xl columns-1 gap-3 px-4 py-3 sm:columns-2 sm:px-8 lg:columns-3 xl:columns-4">
                {topCategories.map((category) => {
                  const descendants = descendantsOf(category.id);
                  return (
                    <section key={category.id} className="mb-2 break-inside-avoid rounded-xl border border-ink/5 bg-white p-2 shadow-sm">
                      <Link
                        href={`/category/${encodeURIComponent(category.slug)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 font-display text-base font-bold text-volt hover:bg-volt/5 hover:text-volt-dim"
                      >
                        <CategoryThumb category={category} />
                        {category.name}
                      </Link>
                      {descendants.length ? (
                        <ul className="mt-1 border-t border-ink/5 pt-1">
                          {descendants.map(({ category: child, depth }) => (
                            <li key={child.id} style={{ paddingLeft: `${depth * 8}px` }}>
                              <Link
                                href={`/category/${encodeURIComponent(child.slug)}`}
                                onClick={() => setCategoriesOpen(false)}
                                className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-muted hover:bg-sand hover:text-ink"
                              >
                                <CategoryThumb category={child} />
                                <span className="line-clamp-1">{child.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  );
                })}
              </div>
            </div>
            <Link
              href="/shop"
              onClick={() => setCategoriesOpen(false)}
              className="border-t border-ink/10 bg-white px-5 py-4 text-center text-sm font-bold text-volt hover:bg-volt/5"
            >
              Виж всички продукти →
            </Link>
            <div className="absolute bottom-16 right-4 flex flex-col gap-2 sm:right-8">
              <button
                type="button"
                onClick={() => categoryListRef.current?.scrollBy({ top: -360, behavior: "smooth" })}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-lg transition hover:bg-volt"
                aria-label="Нагоре"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => categoryListRef.current?.scrollBy({ top: 360, behavior: "smooth" })}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-rose-500 text-white shadow-lg transition hover:scale-105"
                aria-label="Надолу"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}

function CategoryThumb({ category }: { category: CategoryRow }) {
  return (
    <span className="relative flex h-7 w-7 shrink-0 overflow-hidden rounded-md bg-white">
      {category.image ? (
        <Image
          src={category.image}
          alt=""
          fill
          sizes="28px"
          className="object-contain mix-blend-multiply p-0.5"
          unoptimized
        />
      ) : (
        <Menu className="m-auto h-3.5 w-3.5 text-volt" />
      )}
    </span>
  );
}
