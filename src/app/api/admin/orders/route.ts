import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const orders = getDb()
    .prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 100")
    .all();
  return NextResponse.json(orders);
}
