import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const product = getDb().prepare("SELECT * FROM products WHERE id = ?").get(Number(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  getDb()
    .prepare(
      `UPDATE products SET
        name = ?, slug = ?, sku = ?, short_description = ?, description = ?,
        price = ?, regular_price = ?, sale_price = ?, on_sale = ?,
        images_json = ?, categories_json = ?, status = ?, is_in_stock = ?,
        featured = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .run(
      body.name,
      body.slug,
      body.sku || "",
      body.short_description || "",
      body.description || "",
      Number(body.price) || 0,
      Number(body.regular_price) || 0,
      body.sale_price != null && body.sale_price !== "" ? Number(body.sale_price) : null,
      body.on_sale ? 1 : 0,
      typeof body.images_json === "string"
        ? body.images_json
        : JSON.stringify(body.images || []),
      typeof body.categories_json === "string"
        ? body.categories_json
        : JSON.stringify(body.categories || []),
      body.status || "publish",
      body.is_in_stock ? 1 : 0,
      body.featured ? 1 : 0,
      Number(id)
    );
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  getDb().prepare("DELETE FROM product_categories WHERE product_id = ?").run(Number(id));
  getDb().prepare("DELETE FROM products WHERE id = ?").run(Number(id));
  return NextResponse.json({ ok: true });
}
