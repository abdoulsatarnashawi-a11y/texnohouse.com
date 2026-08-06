import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { setSetting } from "@/lib/db";
import { defaultHeader, getHeaderConfig } from "@/lib/store";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getHeaderConfig());
}

export async function PUT(req: NextRequest) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const value = { ...defaultHeader, ...body };
  setSetting("header", value);
  return NextResponse.json({ ok: true, header: value });
}
