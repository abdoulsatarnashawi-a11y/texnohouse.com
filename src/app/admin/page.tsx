import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function AdminDashboard() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");

  const db = getDb();
  const products = (db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number }).c;
  const pages = (db.prepare("SELECT COUNT(*) as c FROM pages").get() as { c: number }).c;
  const orders = (db.prepare("SELECT COUNT(*) as c FROM orders").get() as { c: number }).c;
  const cats = (db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number }).c;

  const cards = [
    { label: "Продукти", value: products, href: "/admin/products" },
    { label: "Категории", value: cats, href: "/admin/products" },
    { label: "Страници", value: pages, href: "/admin/pages" },
    { label: "Поръчки", value: orders, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Табло</h1>
      <p className="mt-2 text-white/60">Здравей, {user}. Управлявай DomoVolt оттук.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-teal-400/40"
          >
            <p className="text-sm text-white/50">{c.label}</p>
            <p className="mt-2 font-display text-4xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/header" className="rounded-2xl border border-dashed border-white/20 p-6 hover:border-teal-400">
          <h2 className="font-semibold">Редакция на хедър</h2>
          <p className="mt-1 text-sm text-white/50">Добавяне, премахване и пренареждане на менюта</p>
        </Link>
        <Link href="/admin/footer" className="rounded-2xl border border-dashed border-white/20 p-6 hover:border-teal-400">
          <h2 className="font-semibold">Редакция на футър</h2>
          <p className="mt-1 text-sm text-white/50">Колони, линкове и долен текст</p>
        </Link>
      </div>
    </div>
  );
}
