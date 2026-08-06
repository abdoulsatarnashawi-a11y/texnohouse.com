import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { setSetting } from "@/lib/db";
import { defaultSettings, getSiteSettings } from "@/lib/store";

export async function GET() {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getSiteSettings());
}

export async function PUT(req: NextRequest) {
  const user = await getAdminSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const value = { ...defaultSettings, ...body };
  setSetting("site", value);
  return NextResponse.json({ ok: true, settings: value });
}
