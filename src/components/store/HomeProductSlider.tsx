"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/money";
import { SLIDER_TRANSPARENT_IMAGES } from "@/lib/sliderImages";
import type { ProductRow } from "@/lib/types";

const slideBackgrounds = [
  "from-[#05080e] via-[#182235] to-[#344256]",
  "from-[#101216] via-[#2a3039] to-[#4b5563]",
  "from-[#070a10] via-[#1f2937] to-[#3f4857]",
  "from-[#111827] via-[#273244] to-[#505b6c]",
  "from-[#171717] via-[#303030] to-[#5a6270]",
];

function productImage(product: ProductRow) {
  if (SLIDER_TRANSPARENT_IMAGES.has(product.id)) {
    return `/slider-products/${product.id}.png`;
  }
  try {
    const images = JSON.parse(product.images_json) as Array<{ src?: string; thumbnail?: string }>;
    return images[0]?.src || images[0]?.thumbnail || "/placeholder-product.svg";
  } catch {
    return "/placeholder-product.svg";
  }
}

export function HomeProductSlider({ products }: { products: ProductRow[] }) {
  const [active, setActive] = useState(0);
  const total = products.length;

  useEffect(() => {
    if (total < 2) return;
    const timer = window.setInterval(() => setActive((item) => (item + 1) % total), 5500);
    return () => window.clearInterval(timer);
  }, [total]);

  if (!total) return null;
  const product = products[active];
  const image = productImage(product);
  const titleSize =
    product.name.length > 125
      ? "text-lg sm:text-xl lg:text-2xl"
      : product.name.length > 85
        ? "text-xl sm:text-2xl lg:text-3xl"
        : product.name.length > 55
          ? "text-xl sm:text-3xl"
          : "text-2xl sm:text-4xl";

  function previous() {
    setActive((item) => (item - 1 + total) % total);
  }

  function next() {
    setActive((item) => (item + 1) % total);
  }

  return (
    <section className="relative overflow-hidden border-b border-ink/5">
      <div className={`min-h-[420px] bg-gradient-to-br ${slideBackgrounds[active % slideBackgrounds.length]} transition-colors duration-500 sm:min-h-[460px]`}>
        <div className="mx-auto grid min-h-[420px] max-w-7xl items-center gap-4 px-5 py-10 sm:min-h-[460px] sm:px-8 lg:grid-cols-2 lg:gap-12 lg:px-4">
          <div className="order-2 animate-fadeUp lg:order-1">
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm ring-1 ring-white/20">
              Избрано предложение
            </p>
            <h1 className={`mt-4 max-w-xl font-display font-extrabold leading-[1.12] tracking-[-0.025em] text-white ${titleSize}`}>
              {product.name}
            </h1>
            <p className="mt-5 text-3xl font-extrabold text-white">
              {formatPrice(product.price)}
            </p>
            {product.on_sale && product.regular_price > product.price ? (
              <p className="mt-1 text-sm font-medium text-white/60 line-through">
                {formatPrice(product.regular_price)}
              </p>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/product/${encodeURIComponent(product.slug)}`}
                className="btn-primary bg-white text-ink hover:bg-white/85"
              >
                Виж детайли
              </Link>
              <Link
                href="/shop"
                className="btn-ghost border-white/30 bg-white/10 text-white hover:border-white hover:text-white"
              >
                <ShoppingBag className="h-4 w-4" /> Към магазина
              </Link>
            </div>
          </div>

          <Link
            href={`/product/${encodeURIComponent(product.slug)}`}
            className="relative order-1 mx-auto flex h-64 w-full max-w-lg items-center justify-center overflow-hidden rounded-3xl bg-transparent p-5 animate-fadeUp lg:order-2 lg:h-96"
          >
            <Image
              key={image}
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 90vw, 50vw"
              className="object-contain p-5"
              priority
              unoptimized
            />
          </Link>
        </div>
      </div>

      {total > 1 ? (
        <>
          <button
            type="button"
            onClick={previous}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-ink hover:text-white sm:left-6"
            aria-label="Предишен продукт"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-ink hover:text-white sm:right-6"
            aria-label="Следващ продукт"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {products.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === active ? "w-7 bg-white" : "w-2.5 bg-white/35 hover:bg-white/70"
                }`}
                aria-label={`Продукт ${index + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
