import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/money";
import { parseImages } from "@/lib/store";
import type { ProductRow } from "@/lib/types";
import { BuyNowButton } from "./AddToCartButton";
import { ProductStatusDots } from "./ProductStatusDots";

export function ProductCard({ product }: { product: ProductRow }) {
  const images = parseImages(product.images_json);
  const src = images[0]?.src || images[0]?.thumbnail || "/placeholder-product.svg";
  const onSale = !!product.on_sale && product.sale_price != null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/5 bg-white/80 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/product/${encodeURIComponent(product.slug)}`} className="relative block aspect-square overflow-hidden bg-sand">
        <Image
          src={src}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-contain p-4 transition duration-500 group-hover:scale-105"
          unoptimized
        />
        {onSale ? (
          <span className="absolute left-3 top-3 rounded-lg bg-accent px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Намалено
          </span>
        ) : null}
        <ProductStatusDots product={product} className="absolute right-3 top-3" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link
          href={`/product/${encodeURIComponent(product.slug)}`}
          className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-snug text-ink transition hover:text-volt"
        >
          {product.name}
        </Link>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-lg font-bold text-ink">
              {formatPrice(product.price)}
            </span>
          </div>
          {onSale && product.regular_price > product.price ? (
            <p className="text-xs text-ink-muted line-through">
              {formatPrice(product.regular_price)}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <BuyNowButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              image: src,
            }}
          />
          <Link
            href={`/product/${encodeURIComponent(product.slug)}`}
            className="inline-flex items-center justify-center rounded-xl border border-ink/10 bg-white px-2 py-2.5 text-xs font-bold text-ink transition hover:border-volt hover:text-volt"
          >
            Виж детайли
          </Link>
        </div>
      </div>
    </article>
  );
}
