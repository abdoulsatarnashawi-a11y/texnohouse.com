import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllCategories } from "@/lib/store";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getAllCategories());
}
