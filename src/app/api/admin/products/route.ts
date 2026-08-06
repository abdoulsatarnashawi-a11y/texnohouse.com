import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { slugifyBg } from "@/lib/store";

export async function GET(req: NextRequest) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const q = req.nextUrl.searchParams.get("q") || "";
  const products = q
    ? getDb()
        .prepare(
          "SELECT id, name, slug, price, on_sale, status, is_in_stock FROM products WHERE name LIKE ? ORDER BY id DESC LIMIT 100"
        )
        .all(`%${q}%`)
    : getDb()
        .prepare(
          "SELECT id, name, slug, price, on_sale, status, is_in_stock FROM products ORDER BY id DESC LIMIT 100"
        )
        .all();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Името е задължително" }, { status: 400 });
  const slug = String(body.slug || slugifyBg(name));
  const id =
    (getDb().prepare("SELECT MAX(id) as m FROM products").get() as { m: number }).m + 1;
  getDb()
    .prepare(
      `INSERT INTO products (id, name, slug, sku, short_description, description, price, regular_price, sale_price, on_sale, images_json, categories_json, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      name,
      slug,
      body.sku || "",
      body.short_description || "",
      body.description || "",
      Number(body.price) || 0,
      Number(body.regular_price) || Number(body.price) || 0,
      body.sale_price != null ? Number(body.sale_price) : null,
      body.on_sale ? 1 : 0,
      JSON.stringify(body.images || []),
      JSON.stringify(body.categories || []),
      body.status || "publish"
    );
  return NextResponse.json({ ok: true, id });
}
