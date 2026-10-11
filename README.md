# KhumFlow

เว็บจัดการร้านภาษาไทยที่มีหน้า dashboard, สินค้า/สต็อก, บันทึกการขาย, รายรับ–รายจ่าย และหน้าเข้าสู่ระบบเจ้าของร้าน

## เริ่มใช้งานในเครื่อง

1. ติดตั้ง Node.js 20.9 ขึ้นไป
2. รัน `npm install`
3. คัดลอก `.env.example` เป็น `.env.local` แล้วกำหนด `OWNER_EMAIL`, `OWNER_PASSWORD` และ `SESSION_SECRET`
4. รัน `npm run dev` แล้วเปิด http://localhost:3000

บัญชีทดลองเริ่มต้น: `admin@khumflow.app` / `admin1234`

## Deploy frontend และ backend บน Vercel

แอป Next.js นี้รวมหน้าเว็บกับ API routes ไว้ในโปรเจกต์เดียว ดังนั้น frontend และ backend จะ deploy พร้อมกันใน Vercel:

1. Push โฟลเดอร์นี้ขึ้น GitHub repository ของคุณ
2. ใน Vercel เลือก **Add New → Project** แล้ว Import repository
3. ตั้งค่า Environment Variables: `OWNER_EMAIL`, `OWNER_PASSWORD`, `SESSION_SECRET` (สร้าง secret ยาวแบบสุ่ม)
4. กด Deploy — Vercel ตรวจจับ Next.js และตั้งค่า build ให้อัตโนมัติ

บัญชี Hobby ของ Vercel ใช้เริ่มต้นได้โดยไม่เสียค่าใช้จ่าย ภายใต้ข้อกำหนดและโควตาปัจจุบันของ Vercel ตรวจสอบข้อกำหนดก่อนนำไปใช้งานเชิงธุรกิจ

## การจัดเก็บข้อมูลในรุ่นทดลอง

- API `/api/auth/login`, `/api/auth/session` และ `/api/auth/logout` จัดการ session ผ่าน cookie แบบ HttpOnly และลายเซ็น HMAC
- รายการสินค้า ยอดขาย รายจ่าย และรูปสินค้าเก็บใน `localStorage` ของเบราว์เซอร์ที่ใช้งาน
- รูปสินค้าเป็น data URL ในเครื่อง จำกัดไฟล์ละ 900 KB
- ข้อมูลใน localStorage ไม่ซิงก์ข้ามอุปกรณ์/ผู้ใช้ และจะหายเมื่อล้างข้อมูล browser หากต้องการใช้งานจริงหลายอุปกรณ์ ให้เชื่อมฐานข้อมูลและ object storage เช่น Supabase ก่อนเปิดใช้กับข้อมูลร้านจริง

ระบบนี้เป็นต้นแบบหนึ่งบัญชีเจ้าของร้าน ไม่มีระบบสมัครสมาชิก/Google OAuth และไม่มีการจัดเก็บข้อมูลฝั่งฐานข้อมูลกลาง
