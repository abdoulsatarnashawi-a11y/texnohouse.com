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
  const page = getDb().prepare("SELECT * FROM pages WHERE id = ?").get(Number(id));
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
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
      `UPDATE pages SET title = ?, slug = ?, content = ?, excerpt = ?, status = ?, menu_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    .run(
      body.title,
      body.slug,
      body.content || "",
      body.excerpt || "",
      body.status || "publish",
      Number(body.menu_order) || 0,
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
  getDb().prepare("DELETE FROM pages WHERE id = ?").run(Number(id));
  return NextResponse.json({ ok: true });
}
