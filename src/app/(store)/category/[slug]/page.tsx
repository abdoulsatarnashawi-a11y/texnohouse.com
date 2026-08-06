import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/store/ProductCard";
import { getCategoryBySlug, listProducts } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(decodeURIComponent(slug));
  return { title: cat?.name || "Категория" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const sp = await searchParams;
  const page = Number(sp.page || 1) || 1;
  const sort = typeof sp.sort === "string" ? sp.sort : "newest";
  const result = listProducts({ categorySlug: slug, page, perPage: 24, sort });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-4 text-sm text-ink-muted">
        <Link href="/" className="hover:text-volt">
          Начало
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-volt">
          Магазин
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{cat.name}</span>
      </nav>
      <h1 className="font-display text-4xl font-bold text-ink">{cat.name}</h1>
      <p className="mt-2 text-ink-muted">{result.total} продукта</p>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
        {result.items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {result.totalPages > 1 ? (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: Math.min(result.totalPages, 12) }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/category/${encodeURIComponent(slug)}?page=${n}&sort=${sort}`}
              className={`min-w-10 rounded-lg px-3 py-2 text-center text-sm font-semibold ${
                n === result.page ? "bg-ink text-white" : "bg-white text-ink"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
