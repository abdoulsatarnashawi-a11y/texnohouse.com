"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

export default function SettingsClient({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial);
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setMsg(res.ok ? "Запазено" : "Грешка");
  }

  const fields: { key: keyof SiteSettings; label: string }[] = [
    { key: "brandName", label: "Марка" },
    { key: "logoText", label: "Лого текст" },
    { key: "tagline", label: "Слоган" },
    { key: "phone", label: "Телефон" },
    { key: "email", label: "Email" },
    { key: "address", label: "Адрес" },
    { key: "company", label: "Фирма" },
    { key: "eik", label: "ЕИК" },
    { key: "currencySymbol", label: "Валутен символ" },
    { key: "announcement", label: "Съобщение в топ бара" },
    { key: "heroImage", label: "URL на началното изображение" },
  ];

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-bold">Настройки</h1>
      {fields.map((f) => (
        <label key={f.key} className="block text-sm">
          {f.label}
          <input
            value={String(s[f.key] ?? "")}
            onChange={(e) => setS({ ...s, [f.key]: e.target.value })}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
          />
        </label>
      ))}
      <label className="block text-sm">
        Безплатна доставка от (€)
        <input
          type="number"
          value={s.freeShippingFrom}
          onChange={(e) => setS({ ...s, freeShippingFrom: Number(e.target.value) })}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5"
        />
      </label>
      <button
        type="button"
        onClick={save}
        className="rounded-xl bg-teal-500 px-5 py-3 font-semibold text-ink"
      >
        Запази
      </button>
      {msg ? <p className="text-teal-300">{msg}</p> : null}
    </div>
  );
}
