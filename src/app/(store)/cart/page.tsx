"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";

export default function CartPage() {
  const { items, total, setQty, remove } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-ink">Количка</h1>
        <p className="mt-3 text-ink-muted">Количката ви е празна.</p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Към магазина
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold text-ink">Количка</h1>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-ink/5 bg-white/80 p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sand">
              {item.image ? (
                <Image src={item.image} alt="" fill className="object-contain p-2" unoptimized />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/product/${encodeURIComponent(item.slug)}`}
                className="font-semibold text-ink hover:text-volt"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-lg border p-2"
                onClick={() => setQty(item.id, item.qty - 1)}
                aria-label="Намали"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-semibold">{item.qty}</span>
              <button
                type="button"
                className="rounded-lg border p-2"
                onClick={() => setQty(item.id, item.qty + 1)}
                aria-label="Увеличи"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="ml-2 rounded-lg p-2 text-accent"
                onClick={() => remove(item.id)}
                aria-label="Премахни"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="font-bold text-ink sm:w-28 sm:text-right">
              {formatPrice(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-ink p-6 text-white sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-white/60">Общо</p>
          <p className="font-display text-3xl font-bold">{formatPrice(total)}</p>
        </div>
        <Link href="/checkout" className="btn-primary bg-volt-bright text-ink hover:bg-white">
          Към поръчка
        </Link>
      </div>
    </div>
  );
}
