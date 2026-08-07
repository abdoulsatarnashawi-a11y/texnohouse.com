"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

export type CartProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image?: string;
};

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: CartProduct;
  compact?: boolean;
}) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className={
        compact
          ? "btn-primary w-full py-2.5 text-xs"
          : "btn-primary w-full sm:w-auto"
      }
      onClick={() => {
        add(product, 1);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? (
        <>
          <Check className="h-4 w-4" /> Добавено
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" /> Добави в количката
        </>
      )}
    </button>
  );
}

export function BuyNowButton({ product }: { product: CartProduct }) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-accent to-rose-500 px-2 py-2.5 text-xs font-bold text-white shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
      onClick={() => {
        add(product, 1);
        router.push("/checkout");
      }}
    >
      <Zap className="h-3.5 w-3.5 fill-current" /> Купи сега
    </button>
  );
}
