"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CustomerAuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/customer/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(result.error || "Възникна грешка.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={submit} className="rounded-3xl border border-ink/5 bg-white/85 p-6 shadow-lift sm:p-8">
        <p className="font-display text-3xl font-bold text-ink">
          {isRegister ? "Създай профил" : "Вход"}
        </p>
        <p className="mt-2 text-sm text-ink-muted">
          {isRegister
            ? "Регистрирай се за по-бързо пазаруване."
            : "Влез в своя клиентски профил."}
        </p>
        {isRegister ? (
          <label className="mt-6 block text-sm font-semibold text-ink">
            Име
            <input name="name" required className="mt-1.5 w-full rounded-xl border border-ink/10 px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-volt/30" />
          </label>
        ) : null}
        <label className="mt-4 block text-sm font-semibold text-ink">
          Email
          <input name="email" type="email" required className="mt-1.5 w-full rounded-xl border border-ink/10 px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-volt/30" />
        </label>
        <label className="mt-4 block text-sm font-semibold text-ink">
          Парола
          <input name="password" type="password" minLength={8} required className="mt-1.5 w-full rounded-xl border border-ink/10 px-3 py-2.5 font-normal outline-none focus:ring-2 focus:ring-volt/30" />
        </label>
        {error ? <p className="mt-4 text-sm font-medium text-accent">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Моля, изчакай..." : isRegister ? "Регистрация" : "Вход"}
        </button>
        <p className="mt-5 text-center text-sm text-ink-muted">
          {isRegister ? "Вече имаш профил?" : "Нямаш профил?"}{" "}
          <Link href={isRegister ? "/login" : "/register"} className="font-bold text-volt hover:underline">
            {isRegister ? "Вход" : "Регистрация"}
          </Link>
        </p>
      </form>
      <p className="mt-5 text-center text-xs text-ink-muted">
        <Link href="/admin/login" className="hover:text-volt">Админ вход</Link>
      </p>
    </div>
  );
}
