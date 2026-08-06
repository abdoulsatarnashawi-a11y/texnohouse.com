"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Грешно потребителско име или парола");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl"
    >
      <h1 className="font-display text-3xl font-bold">
        Domo<span className="text-teal-400">Volt</span>
      </h1>
      <p className="mt-2 text-sm text-white/60">Админ вход</p>
      <label className="mt-8 block text-sm">
        Потребител
        <input
          name="username"
          defaultValue="admin"
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500/40"
        />
      </label>
      <label className="mt-4 block text-sm">
        Парола
        <input
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 outline-none focus:ring-2 focus:ring-teal-500/40"
        />
      </label>
      {error ? <p className="mt-3 text-sm text-orange-300">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-teal-500 py-3 font-semibold text-[#0b1220] hover:bg-teal-400"
      >
        {loading ? "..." : "Вход"}
      </button>
    </form>
  );
}
