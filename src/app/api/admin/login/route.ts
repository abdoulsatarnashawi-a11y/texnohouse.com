import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { COOKIE, MAX_AGE, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = String(body.username || "");
  const password = String(body.password || "");
  const user = getDb()
    .prepare("SELECT * FROM admin_users WHERE username = ?")
    .get(username) as { password_hash: string; username: string } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return NextResponse.json({ error: "Грешни данни" }, { status: 401 });
  }

  const token = createSessionToken(user.username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
