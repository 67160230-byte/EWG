import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EWG — จัดการร้านง่ายในที่เดียว",
  description: "ระบบจัดการสินค้า สต็อก และรายรับรายจ่ายสำหรับร้านค้าขนาดเล็ก",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
