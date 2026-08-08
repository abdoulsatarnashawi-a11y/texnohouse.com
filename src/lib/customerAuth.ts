import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "texnohouse_customer";
const MAX_AGE = 60 * 60 * 24 * 30;

function secret() {
  return (
    process.env.CUSTOMER_SECRET ||
    process.env.ADMIN_SECRET ||
    "texnohouse-customer-secret-change-me"
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createCustomerSession(email: string) {
  const expiry = Date.now() + MAX_AGE * 1000;
  const payload = `${email}.${expiry}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyCustomerSession(token: string | undefined | null) {
  if (!token) return null;
  const [email, expiry, signature] = token.split(".");
  if (!email || !expiry || !signature || Number(expiry) < Date.now()) return null;
  const expected = sign(`${email}.${expiry}`);
  try {
    const supplied = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);
    if (
      supplied.length !== expectedBuffer.length ||
      !timingSafeEqual(supplied, expectedBuffer)
    ) {
      return null;
    }
  } catch {
    return null;
  }
  return email;
}

export async function getCustomerSession() {
  const jar = await cookies();
  return verifyCustomerSession(jar.get(COOKIE)?.value);
}

export { COOKIE, MAX_AGE };
