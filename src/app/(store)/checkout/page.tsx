"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/money";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: fd.get("name"),
          customer_email: fd.get("email"),
          customer_phone: fd.get("phone"),
          address: fd.get("address"),
          city: fd.get("city"),
          notes: fd.get("notes"),
          items,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Грешка");
      clear();
      setDone(data.order_number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Грешка при поръчката");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-4xl font-bold text-ink">Благодарим!</h1>
        <p className="mt-4 text-ink-muted">
          Поръчката е приета. Номер: <strong className="text-ink">{done}</strong>
        </p>
        <p className="mt-2 text-sm text-ink-muted">Ще се свържем с вас за потвърждение.</p>
        <Link href="/shop" className="btn-primary mt-8 inline-flex">
          Продължи пазаруването
        </Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Няма продукти</h1>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          Към магазина
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-10 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h1 className="font-display text-4xl font-bold text-ink">Поръчка</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field name="name" label="Име и фамилия" required />
          <Field name="email" label="Email" type="email" required />
          <Field name="phone" label="Телефон" required />
          <Field name="city" label="Град" required />
          <Field name="address" label="Адрес за доставка" required />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Бележки</span>
            <textarea
              name="notes"
              rows={3}
              className="w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-volt/30"
            />
          </label>
          {error ? <p className="text-sm text-accent">{error}</p> : null}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Изпращане..." : `Поръчай · ${formatPrice(total)}`}
          </button>
        </form>
      </div>
      <aside className="rounded-2xl border border-ink/5 bg-white/80 p-5 lg:col-span-2 h-fit">
        <h2 className="font-display text-xl font-bold">Обобщение</h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3 text-sm">
              <span className="text-ink-muted">
                {i.name} × {i.qty}
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex justify-between border-t pt-4 font-bold">
          <span>Общо</span>
          <span>{formatPrice(total)}</span>
        </p>
      </aside>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-ink/10 bg-white/80 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-volt/30"
      />
    </label>
  );
}
