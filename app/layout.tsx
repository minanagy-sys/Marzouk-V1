import type { Metadata } from "next";
import { El_Messiri, Tajawal } from "next/font/google";
import { LangProvider } from "@/lib/lang";
import { SettingsProvider } from "@/lib/settings";
import { SITE } from "@/lib/site";
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
  metadataBase: new URL(SITE.url),
  title: {
    default: "د. أحمد مرزوق | Dr. Ahmed Marzouk",
    template: "%s | د. أحمد مرزوق",
  },
  description:
    "استشاري النساء والتوليد وجراحة الأورام — مبتكر الولادة بدون ألم في مصر. Consultant of OB-GYN & Oncologic Surgery.",
  keywords: [
    "دكتور نساء وتوليد",
    "ولادة بدون ألم",
    "استئصال الأورام الليفية",
    "التجمع الخامس",
    "مدينة نصر",
    "Dr Ahmed Marzouk",
    "OB-GYN Cairo",
    "pain-free delivery Egypt",
  ],
  openGraph: {
    type: "website",
    siteName: "د. أحمد مرزوق",
    locale: "ar_EG",
    alternateLocale: "en_US",
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${elMessiri.variable} ${tajawal.variable}`}>
        <LangProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
