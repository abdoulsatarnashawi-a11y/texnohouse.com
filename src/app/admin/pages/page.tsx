import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getAllPages } from "@/lib/store";

export default async function AdminPagesList() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  const pages = getAllPages();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">Страници</h1>
        <Link href="/admin/pages/new" className="rounded-xl bg-teal-500 px-4 py-2 text-sm font-semibold text-ink">
          + Нова
        </Link>
      </div>
      <ul className="mt-8 space-y-2">
        {pages.map((p) => (
          <li key={p.id}>
            <Link
              href={`/admin/pages/${p.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 hover:border-teal-400/40"
            >
              <span>
                <span className="font-semibold">{p.title}</span>
                <span className="ml-3 text-xs text-white/40">/p/{p.slug}</span>
              </span>
              <span className="text-xs text-white/40">{p.status}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
