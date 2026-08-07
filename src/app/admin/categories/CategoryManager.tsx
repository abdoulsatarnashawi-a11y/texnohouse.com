"use client";

import { useState } from "react";
import type { CategoryRow } from "@/lib/types";

export default function CategoryManager({
  initial,
}: {
  initial: CategoryRow[];
}) {
  const [categories, setCategories] = useState(initial);
  const [saving, setSaving] = useState<number | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function save(id: number, image: string) {
    setSaving(id);
    setNotice(null);
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    setSaving(null);
    setNotice(res.ok ? "Изображението е запазено." : "Грешка при запис.");
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Категории</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/60">
        Всяка категория има миниатюра. Поставете URL към изображение, за да я
        смените; промените се виждат на началната страница.
      </p>
      {notice ? <p className="mt-3 text-sm text-teal-300">{notice}</p> : null}
      <div className="mt-7 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-4 py-3">Категория</th>
              <th className="px-4 py-3">Продукти</th>
              <th className="px-4 py-3">URL на миниатюрата</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-semibold">
                  {category.parent_id ? "↳ " : ""}
                  {category.name}
                </td>
                <td className="px-4 py-3 text-white/50">{category.count}</td>
                <td className="px-4 py-3">
                  <input
                    value={category.image || ""}
                    onChange={(e) =>
                      setCategories((items) =>
                        items.map((item) =>
                          item.id === category.id
                            ? { ...item, image: e.target.value }
                            : item
                        )
                      )
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => save(category.id, category.image || "")}
                    disabled={saving === category.id}
                    className="rounded-lg bg-teal-500 px-3 py-2 text-xs font-semibold text-ink"
                  >
                    {saving === category.id ? "..." : "Запази"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
