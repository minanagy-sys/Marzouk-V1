import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { LangProvider, type Lang } from "@/lib/lang";
import { SettingsProvider } from "@/lib/settings";
import { SITE } from "@/lib/site";
import "../../globals.css";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "د. أحمد مرزوق | Dr. Ahmed Marzouk",
    template: "%s | د. أحمد مرزوق",
  },
  description:
    "استشاري النساء والتوليد وجراحة الأورام — مبتكر الولادة بدون ألم في مصر. Consultant of OB-GYN & Oncologic Surgery.",
  openGraph: { type: "website", siteName: "د. أحمد مرزوق", url: SITE.url },
  robots: { index: true, follow: true },
};

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const dir = l === "ar" ? "rtl" : "ltr";
  return (
    <html lang={l} dir={dir}>
      <body className={fontVars}>
        <LangProvider lang={l}>
          <SettingsProvider>{children}</SettingsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
