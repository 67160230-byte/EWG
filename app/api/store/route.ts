import { NextRequest, NextResponse } from "next/server";
import { isValidSession } from "../../../lib/auth";
import { isSupabaseConfigured, supabaseAdmin } from "../../../lib/supabase-admin";

export const dynamic = "force-dynamic";

type StoreState = { products: unknown[]; sales: unknown[]; expenses: unknown[] };

function authorized(request: NextRequest) {
  return isValidSession(request.cookies.get("ewg_session")?.value);
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ configured: false, store: null });
  try {
    const { data, error } = await supabaseAdmin().from("store_state").select("data").eq("id", "owner").maybeSingle();
    if (error) throw error;
    return NextResponse.json({ configured: true, store: data?.data ?? null });
  } catch (error) {
    console.error("Store database read failed", error);
    return NextResponse.json({ configured: true, error: "ฐานข้อมูลยังไม่พร้อม ตรวจสอบตาราง store_state และค่า Supabase ใน Vercel" }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase" }, { status: 503 });
  try {
    const store = await request.json() as StoreState;
    if (!store || !Array.isArray(store.products) || !Array.isArray(store.sales) || !Array.isArray(store.expenses)) {
      return NextResponse.json({ error: "รูปแบบข้อมูลร้านไม่ถูกต้อง" }, { status: 400 });
    }
    if (JSON.stringify(store).includes("data:image/")) {
      return NextResponse.json({ error: "รูปสินค้าไม่ได้อัปโหลดไปยังที่เก็บรูป" }, { status: 400 });
    }
    const { error } = await supabaseAdmin().from("store_state").upsert({ id: "owner", data: store, updated_at: new Date().toISOString() });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Store database write failed", error);
    return NextResponse.json({ error: "บันทึกฐานข้อมูลไม่สำเร็จ ตรวจสอบ schema และการเชื่อมต่อ Supabase" }, { status: 503 });
  }
}
