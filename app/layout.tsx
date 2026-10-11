import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EWG — จัดการร้านง่ายในที่เดียว",
  description: "ระบบจัดการร้านเสื้อผ้า สต็อกสินค้า และรายรับรายจ่าย",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
