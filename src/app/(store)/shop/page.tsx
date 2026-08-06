import Link from "next/link";
import { ProductCard } from "@/components/store/ProductCard";
import { listProducts, getTopCategories } from "@/lib/store";

export const metadata = { title: "Магазин" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const sort = typeof sp.sort === "string" ? sp.sort : "newest";
  const sale = sp.sale === "1" || sp.sale === "true";
  const page = Number(sp.page || 1) || 1;
  const q = typeof sp.q === "string" ? sp.q : undefined;

  const result = listProducts({ sort, sale, page, perPage: 24, q });
  const cats = getTopCategories(12);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-ink">Магазин</h1>
        <p className="mt-2 text-ink-muted">
          Показване на {(page - 1) * result.perPage + 1}–
          {Math.min(page * result.perPage, result.total)} от {result.total} резултата
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/category/${encodeURIComponent(c.slug)}`}
            className="rounded-full border border-ink/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink/80 hover:border-volt hover:text-volt"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <FilterLink href="/shop" active={!sale && sort === "newest"} label="Най-нови" />
        <FilterLink href="/shop?sort=popular" active={sort === "popular"} label="Популярни" />
        <FilterLink href="/shop?sort=price_asc" active={sort === "price_asc"} label="Най-евтини" />
        <FilterLink href="/shop?sort=price_desc" active={sort === "price_desc"} label="Най-скъпи" />
        <FilterLink href="/shop?sale=1" active={sale} label="Намаления" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {result.items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {result.totalPages > 1 ? (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: Math.min(result.totalPages, 12) }, (_, i) => i + 1).map((n) => {
            const params = new URLSearchParams();
            if (sale) params.set("sale", "1");
            if (sort && sort !== "newest") params.set("sort", sort);
            if (q) params.set("q", q);
            params.set("page", String(n));
            return (
              <Link
                key={n}
                href={`/shop?${params.toString()}`}
                className={`min-w-10 rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                  n === result.page ? "bg-ink text-white" : "bg-white text-ink hover:bg-volt/10"
                }`}
              >
                {n}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl px-3 py-2 text-sm font-semibold ${
        active ? "bg-ink text-white" : "bg-white/80 text-ink-muted hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}
