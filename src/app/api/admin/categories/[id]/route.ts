import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const image = String(body.image || "").trim() || null;
  getDb()
    .prepare("UPDATE categories SET image = ? WHERE id = ?")
    .run(image, Number(id));
  return NextResponse.json({ ok: true });
}
