import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { LangProvider } from "@/lib/lang";
import { SettingsProvider } from "@/lib/settings";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة التحكم | Admin — Dr. Ahmed Marzouk",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={fontVars}>
        <LangProvider lang="ar">
          <SettingsProvider>{children}</SettingsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
