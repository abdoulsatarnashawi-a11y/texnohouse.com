"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { MenuItem } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function MenuListEditor({
  items,
  onChange,
}: {
  items: MenuItem[];
  onChange: (items: MenuItem[]) => void;
}) {
  function update(i: number, patch: Partial<MenuItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...items, { id: uid(), label: "Нов линк", href: "/" }]);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/20 p-3 sm:flex-row sm:items-center"
        >
          <GripVertical className="hidden h-4 w-4 text-white/30 sm:block" />
          <input
            value={item.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Етикет"
            className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          />
          <input
            value={item.href}
            onChange={(e) => update(i, { href: e.target.value })}
            placeholder="/път"
            className="flex-[1.4] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm"
          />
          <div className="flex gap-1">
            <button
              type="button"
              className="rounded-lg bg-white/10 px-2 py-1 text-xs"
              onClick={() => move(i, -1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="rounded-lg bg-white/10 px-2 py-1 text-xs"
              onClick={() => move(i, 1)}
            >
              ↓
            </button>
            <button
              type="button"
              className="rounded-lg bg-red-500/20 px-2 py-1 text-red-300"
              onClick={() => remove(i)}
              aria-label="Изтрий"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-2 text-sm text-teal-300 hover:border-teal-400"
      >
        <Plus className="h-4 w-4" /> Добави линк
      </button>
    </div>
  );
}
