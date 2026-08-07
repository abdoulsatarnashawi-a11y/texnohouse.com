import Link from "next/link";
import Image from "next/image";
import type { CategoryRow } from "@/lib/types";

const categoryColors = [
  "from-teal-100 via-cyan-50 to-white",
  "from-orange-100 via-amber-50 to-white",
  "from-violet-100 via-fuchsia-50 to-white",
  "from-sky-100 via-blue-50 to-white",
  "from-rose-100 via-pink-50 to-white",
  "from-lime-100 via-emerald-50 to-white",
  "from-yellow-100 via-orange-50 to-white",
  "from-indigo-100 via-slate-50 to-white",
  "from-red-100 via-orange-50 to-white",
  "from-cyan-100 via-teal-50 to-white",
  "from-purple-100 via-violet-50 to-white",
  "from-emerald-100 via-green-50 to-white",
];

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
            className={`group relative isolate aspect-[5/4] overflow-hidden rounded-2xl border border-ink/5 bg-gradient-to-br ${categoryColors[i % categoryColors.length]} shadow-sm transition hover:-translate-y-1 hover:border-volt/50 hover:shadow-lift animate-fadeUp`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-4 mix-blend-multiply drop-shadow-[0_12px_14px_rgba(11,18,32,0.22)] transition duration-500 group-hover:scale-110"
                unoptimized
              />
            ) : null}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent px-4 pb-4 pt-10">
              <p className="font-display text-base font-bold leading-tight text-ink">{c.name}</p>
              <p className="mt-1 text-xs font-medium text-ink-muted">{c.count} продукта</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
