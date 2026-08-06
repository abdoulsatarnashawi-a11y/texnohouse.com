"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: { id: number; name: string; slug: string; price: number; image?: string };
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
