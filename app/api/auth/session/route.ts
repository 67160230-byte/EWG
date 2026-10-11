import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "../../../../lib/auth";

export async function GET(request: NextRequest) {
  const authenticated = isValidSession(request.cookies.get("ewg_session")?.value);
  return NextResponse.json({ authenticated, user: authenticated ? { email: process.env.OWNER_EMAIL || "admin@ewg.app", name: "เจ้าของร้าน" } : null });
}
