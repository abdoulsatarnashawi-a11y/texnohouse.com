import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { slugifyBg } from "@/lib/store";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pages = getDb()
    .prepare("SELECT id, slug, title, status, menu_order, updated_at FROM pages ORDER BY menu_order, title")
    .all();
  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const title = String(body.title || "").trim();
  if (!title) return NextResponse.json({ error: "Заглавието е задължително" }, { status: 400 });
  const slug = String(body.slug || slugifyBg(title));
  const id =
    (getDb().prepare("SELECT MAX(id) as m FROM pages").get() as { m: number | null }).m || 0;
  const newId = id + 1;
  getDb()
    .prepare(
      `INSERT INTO pages (id, slug, title, content, excerpt, status, menu_order) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      newId,
      slug,
      title,
      body.content || "",
      body.excerpt || "",
      body.status || "publish",
      Number(body.menu_order) || 0
    );
  return NextResponse.json({ ok: true, id: newId });
}
