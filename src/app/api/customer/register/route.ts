import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE, MAX_AGE, createCustomerSession } from "@/lib/customerAuth";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  const cleanName = String(name || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPassword = String(password || "");

  if (!cleanName || !cleanEmail.includes("@") || cleanPassword.length < 8) {
    return NextResponse.json(
      { error: "Попълнете име, валиден email и парола с поне 8 знака." },
      { status: 400 }
    );
  }

  const existing = getDb()
    .prepare("SELECT id FROM customers WHERE email = ?")
    .get(cleanEmail);
  if (existing) {
    return NextResponse.json({ error: "Вече има профил с този email." }, { status: 409 });
  }

  getDb()
    .prepare("INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)")
    .run(cleanName, cleanEmail, bcrypt.hashSync(cleanPassword, 12));

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createCustomerSession(cleanEmail), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
