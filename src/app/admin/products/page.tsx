import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  const sp = await searchParams;
  const q = sp.q || "";
  const products = q
    ? (getDb()
        .prepare(
          "SELECT id, name, slug, price, on_sale, status FROM products WHERE name LIKE ? ORDER BY id DESC LIMIT 80"
        )
        .all(`%${q}%`) as { id: number; name: string; slug: string; price: number; on_sale: number; status: string }[])
    : (getDb()
        .prepare(
          "SELECT id, name, slug, price, on_sale, status FROM products ORDER BY id DESC LIMIT 80"
        )
        .all() as { id: number; name: string; slug: string; price: number; on_sale: number; status: string }[]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Продукти</h1>
        <Link
          href="/admin/products/new"
          className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-ink"
        >
          + Нов продукт
        </Link>
      </div>
      <form className="mt-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Търсене..."
          className="w-full max-w-md rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm"
        />
      </form>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Име</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-white/40">{p.id}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="hover:text-teal-300">
                    {p.name}
                  </Link>
                  {p.on_sale ? (
                    <span className="ml-2 rounded bg-orange-500/20 px-1.5 py-0.5 text-[10px] text-orange-300">
                      НАМАЛЕНИЕ
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">{p.price.toFixed(2)} €</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-teal-300">
                    Редакция
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
