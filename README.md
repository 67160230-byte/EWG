# EWG Store

เว็บจัดการร้านสำหรับเจ้าของร้านหนึ่งบัญชี มี dashboard, สินค้า/สต็อก, บันทึกการขาย, รายรับ–รายจ่าย และอัปโหลดรูปสินค้า

## เริ่มใช้งานในเครื่อง

1. ติดตั้ง Node.js 20.9 ขึ้นไป
2. รัน `npm install`
3. คัดลอก `.env.example` เป็น `.env.local` แล้วกำหนด `OWNER_EMAIL`, `OWNER_PASSWORD` และ `SESSION_SECRET`
4. รัน `npm run dev` แล้วเปิด http://localhost:3000

## ฐานข้อมูลและรูปสินค้า (Supabase)

1. สร้าง Supabase project ใน organization ฟรีของ EWG เลือก region Asia-Pacific
2. ใน Dashboard เปิด **SQL Editor**, วางเนื้อหาไฟล์ `supabase/schema.sql` แล้วกด Run เพื่อสร้างตาราง
3. เปิด **Storage → New bucket**, ตั้งชื่อ `product-images`, เปิด **Public bucket**, จำกัดชนิดรูปเป็น JPEG, PNG, WebP และขนาดไม่เกิน 1 MB
4. ใน **Project Settings → API Keys** คัดลอก Project URL และ Secret key (`sb_secret_...`) เก็บไว้เป็นความลับ ห้ามใช้ publishable/anon key แทน Secret key
5. ตั้ง Environment Variables ใน Vercel:
   - `OWNER_EMAIL` — อีเมลเจ้าของร้าน
   - `OWNER_PASSWORD` — รหัสผ่านที่เดายากและใช้เฉพาะที่นี่
   - `SESSION_SECRET` — สร้างค่าสุ่มใหม่ที่ยาวอย่างน้อย 32 ไบต์
   - `SUPABASE_URL` — Project URL
   - `SUPABASE_SECRET_KEY` — Secret key ของโปรเจกต์
6. เลือกให้ตัวแปรมีผลกับ Production และ Preview แล้ว Redeploy โปรเจกต์ Vercel

รหัสผ่านฐานข้อมูลที่ใช้ตอนสร้าง Supabase project ใช้สำหรับเชื่อมต่อ Postgres โดยตรง ไม่ใช่ค่าที่แอปต้องใช้ และไม่ต้องใส่ใน Vercel สำหรับการเชื่อมแบบนี้

## Deploy frontend และ backend บน Vercel

แอป Next.js นี้รวมหน้าเว็บและ backend API routes ใน repository เดียวกัน จึง import repository เข้า Vercel และ deploy พร้อมกันได้ ไม่ต้องแยก backend project หรือใช้ Docker

1. Import repository นี้ใน Vercel โดยใช้ root directory `./` และ preset `Next.js`
2. เพิ่ม Environment Variables ตามรายการด้านบนก่อน deploy
3. กด Deploy; เมื่อเปลี่ยน Environment Variables ให้ Redeploy อีกครั้ง

## การจัดเก็บและความปลอดภัย

- เมื่อ Supabase ตั้งค่าครบ สินค้า ยอดขาย และรายจ่ายจะบันทึกในตาราง `store_state`; รูปสินค้าเก็บใน Storage และแสดงผ่าน public URL
- รูปเป็นข้อมูลที่เข้าถึงได้ผ่าน URL สาธารณะตามการตั้งค่า public bucket; การอัปโหลดทำผ่าน API ฝั่ง server เท่านั้น
- Secret key ไม่ถูกส่งไป browser; API สำหรับข้อมูลและอัปโหลดรูปตรวจสอบ session เจ้าของร้าน
- ถ้ายังไม่ได้ตั้งค่า Supabase ตัวอย่างจะเก็บข้อมูลไว้ใน localStorage ของ browser เครื่องนั้นเท่านั้น
- เมื่อเชื่อม cloud ครั้งแรก แอปจะพยายามย้ายข้อมูลเดิมจาก localStorage และอัปโหลดรูป base64 ไป Storage
- Free tier มีโควตาและข้อกำหนดที่เปลี่ยนแปลงได้: ตรวจสอบ [Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase) และ [free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
