import Link from "next/link";
import type { CategoryRow } from "@/lib/types";

export function CategoryStrip({ categories }: { categories: CategoryRow[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Категории</h2>
          <p className="mt-2 text-ink-muted">Разгледай по тип уред или аксесоар</p>
        </div>
        <Link href="/shop" className="hidden text-sm font-semibold text-volt sm:inline hover:underline">
          Виж всички
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <Link
            key={c.id}
            href={`/category/${encodeURIComponent(c.slug)}`}
            className="group rounded-2xl border border-ink/5 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-volt/30 hover:shadow-lift animate-fadeUp"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <p className="font-semibold text-ink group-hover:text-volt">{c.name}</p>
            <p className="mt-1 text-xs text-ink-muted">{c.count} продукта</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
