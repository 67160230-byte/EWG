import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isValidSession } from "../../../../lib/auth";
import { isSupabaseConfigured, supabaseAdmin } from "../../../../lib/supabase-admin";

const mimeExtensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(request: NextRequest) {
  if (!isValidSession(request.cookies.get("ewg_session")?.value)) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบใหม่" }, { status: 401 });
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า Supabase Storage" }, { status: 503 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
    const extension = mimeExtensions[file.type];
    if (!extension) return NextResponse.json({ error: "รองรับเฉพาะ JPG, PNG และ WebP" }, { status: 415 });
    if (file.size <= 0 || file.size > 900_000) return NextResponse.json({ error: "รูปต้องมีขนาดไม่เกิน 900 KB" }, { status: 413 });

    const path = `${randomUUID()}.${extension}`;
    const supabase = supabaseAdmin();
    const { error } = await supabase.storage.from("product-images").upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Product image upload failed", error);
    return NextResponse.json({ error: "อัปโหลดรูปไม่สำเร็จ ตรวจสอบ bucket product-images ใน Supabase" }, { status: 503 });
  }
}
