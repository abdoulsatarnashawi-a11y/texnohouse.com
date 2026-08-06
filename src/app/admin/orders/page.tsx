import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export default async function AdminOrdersPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  const orders = getDb()
    .prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 100")
    .all() as {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    total: number;
    status: string;
    created_at: string;
    items_json: string;
    address: string;
    city: string;
  }[];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Поръчки</h1>
      <div className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <p className="text-white/50">Все още няма поръчки.</p>
        ) : (
          orders.map((o) => (
            <article
              key={o.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{o.order_number}</p>
                  <p className="text-sm text-white/50">{o.created_at}</p>
                </div>
                <p className="font-bold text-teal-300">{formatPrice(o.total)}</p>
              </div>
              <p className="mt-3 text-sm">
                {o.customer_name} · {o.customer_phone} · {o.customer_email}
              </p>
              <p className="text-sm text-white/60">
                {o.city} {o.address}
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs text-white/70">
                {JSON.stringify(JSON.parse(o.items_json), null, 2)}
              </pre>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
