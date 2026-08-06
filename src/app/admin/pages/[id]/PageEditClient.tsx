"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { PageRow } from "@/lib/types";

export default function PageEditClient({
  page,
  isNew = false,
}: {
  page?: PageRow;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title"),
      slug: fd.get("slug"),
      content: fd.get("content"),
      status: fd.get("status"),
      menu_order: Number(fd.get("menu_order") || 0),
    };
    const res = isNew
      ? await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/admin/pages/${page!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    if (!res.ok) {
      setMsg("Грешка");
      return;
    }
    if (isNew) {
      const data = await res.json();
      router.push(`/admin/pages/${data.id}`);
      return;
    }
    setMsg("Запазено");
    router.refresh();
  }

  async function onDelete() {
    if (!page || !confirm("Изтриване?")) return;
    await fetch(`/api/admin/pages/${page.id}`, { method: "DELETE" });
    router.push("/admin/pages");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
      <div className="flex justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">
          {isNew ? "Нова страница" : "Редакция на страница"}
        </h1>
        {!isNew ? (
          <button type="button" onClick={onDelete} className="text-sm text-red-300">
            Изтрий
          </button>
        ) : null}
      </div>
      <label className="block text-sm">
        Заглавие
        <input
          name="title"
          required
          defaultValue={page?.title}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        Slug
        <input
          name="slug"
          required
          defaultValue={page?.slug}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        Ред
        <input
          name="menu_order"
          type="number"
          defaultValue={page?.menu_order ?? 0}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        />
      </label>
      <label className="block text-sm">
        Статус
        <select
          name="status"
          defaultValue={page?.status || "publish"}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        >
          <option value="publish">publish</option>
          <option value="draft">draft</option>
        </select>
      </label>
      <label className="block text-sm">
        Съдържание (HTML)
        <textarea
          name="content"
          rows={16}
          defaultValue={page?.content || ""}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 font-mono text-xs"
        />
      </label>
      <button type="submit" className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-ink">
        Запази
      </button>
      {msg ? <p className="text-teal-300">{msg}</p> : null}
      {!isNew && page ? (
        <p className="text-sm text-white/40">
          Публичен адрес: /p/{page.slug}
        </p>
      ) : null}
    </form>
  );
}
