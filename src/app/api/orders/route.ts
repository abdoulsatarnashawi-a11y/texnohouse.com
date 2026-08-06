import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      notes,
      items,
      total,
    } = body;

    if (!customer_name || !customer_email || !customer_phone || !address) {
      return NextResponse.json({ error: "Попълнете задължителните полета" }, { status: 400 });
    }
    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: "Количката е празна" }, { status: 400 });
    }

    const orderNumber = `DV-${Date.now().toString(36).toUpperCase()}`;
    getDb()
      .prepare(
        `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, address, city, notes, items_json, total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        orderNumber,
        String(customer_name),
        String(customer_email),
        String(customer_phone),
        String(address),
        String(city || ""),
        String(notes || ""),
        JSON.stringify(items),
        Number(total) || 0
      );

    return NextResponse.json({ ok: true, order_number: orderNumber });
  } catch {
    return NextResponse.json({ error: "Сървърна грешка" }, { status: 500 });
  }
}
