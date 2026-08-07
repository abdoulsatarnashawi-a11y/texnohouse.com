"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductRow } from "@/lib/types";

export default function ProductEditClient({
  product,
  isNew = false,
}: {
  product?: ProductRow;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      slug: fd.get("slug"),
      sku: fd.get("sku"),
      price: fd.get("price"),
      regular_price: fd.get("regular_price"),
      sale_price: fd.get("sale_price"),
      on_sale: fd.get("on_sale") === "on",
      is_in_stock: fd.get("is_in_stock") === "on",
      featured: fd.get("featured") === "on",
      status: fd.get("status"),
      short_description: fd.get("short_description"),
      description: fd.get("description"),
      images_json: fd.get("images_json"),
      categories_json: product?.categories_json || "[]",
    };

    const res = isNew
      ? await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            images: JSON.parse(String(payload.images_json || "[]")),
          }),
        })
      : await fetch(`/api/admin/products/${product!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      setMsg("Грешка при запис");
      return;
    }
    if (isNew) {
      const data = await res.json();
      router.push(`/admin/products/${data.id}`);
      return;
    }
    setMsg("Запазено");
    router.refresh();
  }

  async function onDelete() {
    if (!product || !confirm("Изтриване на продукта?")) return;
    await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    router.push("/admin/products");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">
          {isNew ? "Нов продукт" : "Редакция на продукт"}
        </h1>
        {!isNew ? (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-xl bg-red-500/20 px-4 py-2 text-sm text-red-300"
          >
            Изтрий
          </button>
        ) : null}
      </div>

      <Field name="name" label="Име" defaultValue={product?.name} required />
      <Field name="slug" label="Slug" defaultValue={product?.slug} required />
      <Field name="sku" label="SKU" defaultValue={product?.sku} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          name="price"
          label="Цена"
          type="number"
          step="0.01"
          defaultValue={product?.price ?? 0}
          required
        />
        <Field
          name="regular_price"
          label="Редовна цена"
          type="number"
          step="0.01"
          defaultValue={product?.regular_price ?? 0}
        />
        <Field
          name="sale_price"
          label="Промо цена"
          type="number"
          step="0.01"
          defaultValue={product?.sale_price ?? ""}
        />
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input name="on_sale" type="checkbox" defaultChecked={!!product?.on_sale} /> Намаление
        </label>
        <label className="flex items-center gap-2">
          <input name="is_in_stock" type="checkbox" defaultChecked={product ? !!product.is_in_stock : true} /> В наличност
        </label>
        <label className="flex items-center gap-2">
          <input name="featured" type="checkbox" defaultChecked={!!product?.featured} /> Нов продукт
        </label>
      </div>

      <label className="block text-sm">
        Статус
        <select
          name="status"
          defaultValue={product?.status || "publish"}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        >
          <option value="publish">publish</option>
          <option value="draft">draft</option>
        </select>
      </label>

      <label className="block text-sm">
        Кратко описание (HTML)
        <textarea
          name="short_description"
          rows={3}
          defaultValue={product?.short_description || ""}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs"
        />
      </label>
      <label className="block text-sm">
        Описание (HTML)
        <textarea
          name="description"
          rows={10}
          defaultValue={product?.description || ""}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs"
        />
      </label>
      <label className="block text-sm">
        Изображения (JSON)
        <textarea
          name="images_json"
          rows={4}
          defaultValue={product?.images_json || "[]"}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs"
        />
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-ink"
      >
        {saving ? "..." : "Запази"}
      </button>
      {msg ? <p className="text-sm text-teal-300">{msg}</p> : null}
    </form>
  );
}

function Field(props: {
  name: string;
  label: string;
  defaultValue?: string | number;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      {props.label}
      <input
        name={props.name}
        type={props.type || "text"}
        step={props.step}
        required={props.required}
        defaultValue={props.defaultValue}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
      />
    </label>
  );
}
