import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { COOKIE, MAX_AGE, createCustomerSession } from "@/lib/customerAuth";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const customer = getDb()
    .prepare("SELECT email, password_hash FROM customers WHERE email = ?")
    .get(cleanEmail) as { email: string; password_hash: string } | undefined;

  if (!customer || !bcrypt.compareSync(String(password || ""), customer.password_hash)) {
    return NextResponse.json({ error: "Грешен email или парола." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, createCustomerSession(customer.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}
