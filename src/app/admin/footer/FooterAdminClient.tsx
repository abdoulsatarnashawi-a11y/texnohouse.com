"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { MenuListEditor } from "@/components/admin/MenuListEditor";
import type { FooterConfig } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FooterAdminClient({ initial }: { initial: FooterConfig }) {
  const [footer, setFooter] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/footer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(footer),
    });
    setSaving(false);
    setMsg(res.ok ? "Запазено успешно" : "Грешка при запис");
  }

  function addColumn() {
    setFooter({
      ...footer,
      columns: [
        ...footer.columns,
        { id: uid(), title: "Нова колона", links: [] },
      ],
    });
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Футър</h1>
        <p className="mt-2 text-white/60">
          Колони и линкове — добавяне, редакция и изтриване.
        </p>
      </div>

      {footer.columns.map((col, ci) => (
        <section key={col.id} className="rounded-2xl border border-white/10 p-4">
          <div className="mb-4 flex items-center gap-2">
            <input
              value={col.title}
              onChange={(e) => {
                const columns = footer.columns.map((c, i) =>
                  i === ci ? { ...c, title: e.target.value } : c
                );
                setFooter({ ...footer, columns });
              }}
              className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-semibold"
            />
            <button
              type="button"
              className="rounded-lg bg-red-500/20 p-2 text-red-300"
              onClick={() =>
                setFooter({
                  ...footer,
                  columns: footer.columns.filter((_, i) => i !== ci),
                })
              }
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <MenuListEditor
            items={col.links}
            onChange={(links) => {
              const columns = footer.columns.map((c, i) =>
                i === ci ? { ...c, links } : c
              );
              setFooter({ ...footer, columns });
            }}
          />
        </section>
      ))}

      <button
        type="button"
        onClick={addColumn}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-2 text-sm text-teal-300"
      >
        <Plus className="h-4 w-4" /> Добави колона
      </button>

      <label className="block">
        <span className="mb-1 block text-sm text-white/60">Долен текст</span>
        <input
          value={footer.bottomText}
          onChange={(e) => setFooter({ ...footer, bottomText: e.target.value })}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        />
      </label>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-ink hover:bg-teal-400"
      >
        {saving ? "Запис..." : "Запази футъра"}
      </button>
      {msg ? <p className="text-sm text-teal-300">{msg}</p> : null}
    </div>
  );
}
