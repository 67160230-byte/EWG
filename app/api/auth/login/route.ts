import { NextResponse } from "next/server";
import { createSessionToken } from "../../../../lib/auth";

export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (process.env.NODE_ENV === "production" && (!process.env.OWNER_EMAIL || !process.env.OWNER_PASSWORD || !process.env.SESSION_SECRET)) {
    return NextResponse.json({ error: "กรุณาตั้งค่าบัญชีเจ้าของร้านใน Environment Variables ก่อน" }, { status: 503 });
  }
  const ownerEmail = process.env.OWNER_EMAIL || "admin@ewg.app";
  const ownerPassword = process.env.OWNER_PASSWORD || "change-this-password";
  if (email !== ownerEmail || password !== ownerPassword) {
    return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
  }
  const response = NextResponse.json({ user: { email: ownerEmail, name: "เจ้าของร้าน" } });
  response.cookies.set("ewg_session", createSessionToken(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
