import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminSession();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1220] p-4 text-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-white/10 bg-black/20 p-4 md:block">
          <Link href="/admin" className="font-display text-xl font-bold">
            Texno<span className="text-teal-400">House</span> Admin
          </Link>
          <nav className="mt-8 space-y-1 text-sm">
            {[
              ["/admin", "Табло"],
              ["/admin/products", "Продукти"],
              ["/admin/pages", "Страници"],
              ["/admin/header", "Хедър"],
              ["/admin/footer", "Футър"],
              ["/admin/settings", "Настройки"],
              ["/admin/orders", "Поръчки"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/"
              className="mt-6 block rounded-lg px-3 py-2 text-teal-300 hover:bg-white/5"
            >
              ← Към сайта
            </Link>
            <LogoutButton />
          </nav>
        </aside>
        <div className="flex-1 overflow-auto">
          <div className="border-b border-white/10 px-4 py-3 md:hidden">
            <p className="font-display font-bold">Admin · {user}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {[
                ["/admin", "Табло"],
                ["/admin/products", "Продукти"],
                ["/admin/header", "Хедър"],
                ["/admin/footer", "Футър"],
                ["/admin/pages", "Страници"],
                ["/admin/settings", "Настройки"],
                ["/admin/orders", "Поръчки"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="rounded bg-white/10 px-2 py-1">
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
