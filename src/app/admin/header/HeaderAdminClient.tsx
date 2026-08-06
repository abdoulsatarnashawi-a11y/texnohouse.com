"use client";

import { useState } from "react";
import { MenuListEditor } from "@/components/admin/MenuListEditor";
import type { HeaderConfig } from "@/lib/types";

export default function HeaderAdminClient({ initial }: { initial: HeaderConfig }) {
  const [header, setHeader] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/header", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(header),
    });
    setSaving(false);
    setMsg(res.ok ? "Запазено успешно" : "Грешка при запис");
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Хедър</h1>
        <p className="mt-2 text-white/60">
          Добавяй, редактирай, премахвай и пренареждай линковете в менюто.
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Главно меню</h2>
        <MenuListEditor
          items={header.mainMenu}
          onChange={(mainMenu) => setHeader({ ...header, mainMenu })}
        />
      </section>

      <section>
        <h2 className="mb-3 font-semibold">Горни линкове</h2>
        <MenuListEditor
          items={header.topBarLinks}
          onChange={(topBarLinks) => setHeader({ ...header, topBarLinks })}
        />
      </section>

      <section className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={header.showSearch}
            onChange={(e) => setHeader({ ...header, showSearch: e.target.checked })}
          />
          Покажи търсачка
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={header.showCart}
            onChange={(e) => setHeader({ ...header, showCart: e.target.checked })}
          />
          Покажи количка
        </label>
      </section>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-ink hover:bg-teal-400"
      >
        {saving ? "Запис..." : "Запази хедъра"}
      </button>
      {msg ? <p className="text-sm text-teal-300">{msg}</p> : null}
    </div>
  );
}
