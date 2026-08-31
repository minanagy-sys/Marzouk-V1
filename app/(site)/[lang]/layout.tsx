import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { LangProvider, type Lang } from "@/lib/lang";
import { SettingsProvider } from "@/lib/settings";
import { getSiteContent } from "@/lib/data/siteContent";
import Analytics from "@/components/Analytics";
import { SITE } from "@/lib/site";
import "../../globals.css";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteContent();
  const val = (k: string) => (settings[k]?.en || settings[k]?.ar || "").trim();
  const google = val("integrations.gsc");
  const bing = val("integrations.bing");
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: "د. أحمد مرزوق | Dr. Ahmed Marzouk",
      template: "%s | د. أحمد مرزوق",
    },
    description:
      "استشاري النساء والتوليد وجراحة الأورام — مبتكر الولادة بدون ألم في مصر. Consultant of OB-GYN & Oncologic Surgery.",
    openGraph: {
      type: "website", siteName: "د. أحمد مرزوق", url: SITE.url,
      ...(process.env.NEXT_PUBLIC_OG_IMAGE ? { images: [{ url: process.env.NEXT_PUBLIC_OG_IMAGE }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      ...(process.env.NEXT_PUBLIC_OG_IMAGE ? { images: [process.env.NEXT_PUBLIC_OG_IMAGE] } : {}),
    },
    ...(google || bing
      ? { verification: { ...(google ? { google } : {}), ...(bing ? { other: { "msvalidate.01": bing } } : {}) } }
      : {}),
    robots: { index: true, follow: true },
  };
}

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
  const settings = await getSiteContent();
  const iv = (k: string) => (settings[k]?.en || settings[k]?.ar || "").trim() || undefined;
  return (
    <html lang={l} dir={dir}>
      <body className={fontVars}>
        <Analytics ga4={iv("integrations.ga4")} gtm={iv("integrations.gtm")} pixel={iv("integrations.metaPixel")} />
        <LangProvider lang={l}>
          <SettingsProvider initial={settings}>{children}</SettingsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
