import { NextResponse } from "next/server";
import { createSessionToken } from "../../../../lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));
  const ownerEmail = process.env.OWNER_EMAIL || "admin@khumflow.app";
  const ownerPassword = process.env.OWNER_PASSWORD || "admin1234";
  if (email !== ownerEmail || password !== ownerPassword) {
    return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  const response = NextResponse.json({ user: { email: ownerEmail, name: "เจ้าของร้าน" } });
  response.cookies.set("khumflow_session", createSessionToken(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
