import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KhumFlow — จัดการร้านง่ายในที่เดียว",
  description: "ระบบจัดการต้นทุน สต็อก และรายรับรายจ่ายสำหรับร้านค้าขนาดเล็ก",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
