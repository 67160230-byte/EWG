import { createHmac, timingSafeEqual } from "node:crypto";

function secret() {
  return process.env.SESSION_SECRET || `local-demo:${process.env.OWNER_PASSWORD || "admin1234"}`;
}

export function createSessionToken() {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ sub: process.env.OWNER_EMAIL || "admin@khumflow.app", exp: expiresAt })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function isValidSession(token?: string) {
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  let supplied: Buffer;
  try { supplied = Buffer.from(signature, "base64url"); } catch { return false; }
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number };
    return session.sub === (process.env.OWNER_EMAIL || "admin@khumflow.app") && typeof session.exp === "number" && session.exp > Date.now();
  } catch { return false; }
}
