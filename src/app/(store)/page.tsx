import Link from "next/link";
import { TrustBar } from "@/components/store/Hero";
import { HomeProductSlider } from "@/components/store/HomeProductSlider";
import { CategoryStrip } from "@/components/store/CategoryStrip";
import { ProductCard } from "@/components/store/ProductCard";
import { listProducts, getTopCategories } from "@/lib/store";

export default function HomePage() {
  const featured = listProducts({ featured: true, perPage: 8, sort: "newest" });
  const sliderProducts = listProducts({ perPage: 60, sort: "newest" });
  const sale = listProducts({ sale: true, perPage: 8, sort: "popular" });
  const cats = getTopCategories(12);

  return (
    <>
      <HomeProductSlider products={sliderProducts.items} />
      <TrustBar />
      <CategoryStrip categories={cats} />

      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Избрани продукти</h2>
            <p className="mt-2 text-ink-muted">Подбрани предложения за вашия дом</p>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-volt hover:underline">
            Магазин
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {featured.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Намаления</h2>
            <p className="mt-2 text-ink-muted">Спестете сега с актуални промоции</p>
          </div>
          <Link href="/shop?sale=1" className="text-sm font-semibold text-volt hover:underline">
            Всички промоции
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {sale.items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12">
          <p className="font-display text-3xl font-bold sm:text-5xl">
            Texno<span className="text-volt-bright">House</span>
          </p>
          <p className="mt-4 max-w-2xl text-white/75">
            Готови сте за нов уред или кухненски аксесоар? Разгледайте целия каталог —
            над {featured.total > 0 ? "400" : "стотици"} продукта с доставка до вас.
          </p>
          <Link href="/shop" className="btn-primary mt-8 bg-volt-bright text-ink hover:bg-white">
            Разгледай каталога
          </Link>
        </div>
      </section>
    </>
  );
}
