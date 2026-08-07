import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Headphones } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section className="relative min-h-[78vh] overflow-hidden">
      {/* Full-bleed product atmosphere */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url('${settings.heroImage}')` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />

      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 py-20 text-white">
        <p className="animate-fadeUp font-display text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
          Texno<span className="text-volt-bright">House</span>
        </p>
        <h1
          className="mt-5 max-w-2xl animate-fadeUp text-2xl font-semibold leading-tight text-white/95 sm:text-4xl"
          style={{ animationDelay: "120ms" }}
        >
          Електроуреди и кухня — подбрани за всеки дом
        </h1>
        <p
          className="mt-4 max-w-xl animate-fadeUp text-base text-white/75 sm:text-lg"
          style={{ animationDelay: "220ms" }}
        >
          Над 400 продукта с ясни цени, бърза доставка и грижа след покупката.
        </p>
        <div
          className="mt-8 flex flex-wrap gap-3 animate-fadeUp"
          style={{ animationDelay: "320ms" }}
        >
          <Link
            href="/shop"
            className="btn-primary bg-volt-bright text-ink hover:bg-white"
          >
            Към магазина <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/shop?sale=1"
            className="btn-ghost border-white/30 bg-white/10 text-white hover:border-white hover:text-white"
          >
            Виж намаленията
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = [
    { icon: Truck, title: "Бърза доставка", text: "Из цялата страна" },
    { icon: ShieldCheck, title: "Сигурна покупка", text: "Гаранция и подкрепа" },
    { icon: Headphones, title: "Помощ по телефона", text: "Екип готов да помогне" },
  ];
  return (
    <div className="relative z-10 -mt-10 px-4">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="glass flex items-center gap-4 rounded-2xl p-4 shadow-lift animate-fadeUp"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-volt/10 text-volt">
              <item.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-ink">{item.title}</p>
              <p className="text-sm text-ink-muted">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
