import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import { LangProvider } from "@/lib/lang";
import "./globals.css";

// Fonts loaded/optimized by Next — exposed as CSS variables used across the site.
const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-el-messiri",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "د. أحمد مرزوق | Dr. Ahmed Marzouk",
  description:
    "استشاري النساء والتوليد وجراحة الأورام — مبتكر الولادة بدون ألم في مصر. Consultant of OB-GYN & Oncologic Surgery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${elMessiri.variable} ${tajawal.variable}`}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
