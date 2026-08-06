import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { ProductCard } from "@/components/store/ProductCard";
import { formatEuroHint, formatPrice } from "@/lib/money";
import {
  getProductBySlug,
  listProducts,
  parseImages,
  parseJsonArray,
} from "@/lib/store";
import type { ProductCategoryRef } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(decodeURIComponent(slug));
  return {
    title: product?.name || "Продукт",
    description: product?.short_description?.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: raw } = await params;
  const slug = decodeURIComponent(raw);
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const images = parseImages(product.images_json);
  const cats = parseJsonArray<ProductCategoryRef>(product.categories_json);
  const main = images[0]?.src || "/placeholder-product.svg";
  const related = listProducts({
    categorySlug: cats[0]?.slug,
    perPage: 4,
    sort: "popular",
  }).items.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-sm text-ink-muted">
        <Link href="/" className="hover:text-volt">
          Начало
        </Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-volt">
          Магазин
        </Link>
        {cats[0] ? (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/category/${encodeURIComponent(cats[0].slug)}`}
              className="hover:text-volt"
            >
              {cats[0].name}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-ink/5 bg-white/80 p-6 shadow-sm">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
            <Image
              src={main}
              alt={product.name}
              fill
              className="object-contain p-6"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
              unoptimized
            />
          </div>
          {images.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, i) => (
                <div
                  key={img.src + i}
                  className="relative aspect-square overflow-hidden rounded-xl bg-sand"
                >
                  <Image
                    src={img.thumbnail || img.src}
                    alt=""
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          {product.on_sale ? (
            <span className="inline-block rounded-lg bg-accent px-2.5 py-1 text-xs font-bold uppercase text-white">
              Разпродажба
            </span>
          ) : null}
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-ink">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-ink-muted">{formatEuroHint(product.price)}</span>
            {product.on_sale && product.regular_price > product.price ? (
              <span className="text-lg text-ink-muted line-through">
                {formatPrice(product.regular_price)}
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm text-ink-muted">
            {product.is_in_stock ? "В наличност" : "Изчерпан"}
            {product.sku ? ` · SKU: ${product.sku}` : null}
          </p>

          <div className="mt-8">
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: main,
              }}
            />
          </div>

          {cats.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {cats.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${encodeURIComponent(c.slug)}`}
                  className="rounded-full bg-volt/10 px-3 py-1 text-xs font-semibold text-volt"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold text-ink">Описание</h2>
        <div
          className="prose-store mt-4 max-w-none rounded-2xl border border-ink/5 bg-white/70 p-6"
          dangerouslySetInnerHTML={{
            __html: product.description || product.short_description || "<p>Няма описание.</p>",
          }}
        />
      </section>

      {related.length ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ink">Може да харесате още</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
