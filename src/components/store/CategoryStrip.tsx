import Link from "next/link";
import Image from "next/image";
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
            className="group relative isolate min-h-44 overflow-hidden rounded-2xl border border-ink/5 bg-ink shadow-sm transition hover:-translate-y-1 hover:border-volt/30 hover:shadow-lift animate-fadeUp"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-75 transition duration-500 group-hover:scale-110 group-hover:opacity-90"
                unoptimized
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="relative flex h-full min-h-44 flex-col justify-end p-5">
              <p className="font-display text-lg font-bold text-white">{c.name}</p>
              <p className="mt-1 text-xs font-medium text-white/70">{c.count} продукта</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
