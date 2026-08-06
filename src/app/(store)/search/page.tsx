import { ProductCard } from "@/components/store/ProductCard";
import { listProducts } from "@/lib/store";

export const metadata = { title: "Търсене" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const result = q
    ? listProducts({ q, perPage: 24, page: Number(sp.page || 1) || 1 })
    : { items: [], total: 0, page: 1, perPage: 24, totalPages: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold text-ink">Търсене</h1>
      <p className="mt-2 text-ink-muted">
        {q ? (
          <>
            Резултати за „{q}“ — {result.total} продукта
          </>
        ) : (
          "Въведете заявка в търсачката."
        )}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {result.items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
