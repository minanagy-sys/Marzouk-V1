import type { Metadata } from "next";
import { fontVars } from "@/lib/fonts";
import { LangProvider, type Lang } from "@/lib/lang";
import { SettingsProvider } from "@/lib/settings";
import { getSiteContent } from "@/lib/data/siteContent";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { siteGraph } from "@/lib/schema";
import { SITE } from "@/lib/site";
import "../../globals.css";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const brand = lang === "en" ? "Dr. Ahmed Marzouk" : "د. أحمد مرزوق";
  const settings = await getSiteContent();
  const val = (k: string) => (settings[k]?.en || settings[k]?.ar || "").trim();
  const google = val("integrations.gsc");
  const bing = val("integrations.bing");
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: "د. أحمد مرزوق | Dr. Ahmed Marzouk",
      // Appends the brand once, in the page's language. Page titles are kept
      // brand-free (see lib/seo stripBrand) so this never doubles up.
      template: `%s | ${brand}`,
    },
    description:
      "استشاري النساء والتوليد وجراحة الأورام — مبتكر الولادة بدون ألم في مصر. Consultant of OB-GYN & Oncologic Surgery.",
    icons: {
      icon: [
        { url: "/brand/favicon.ico", sizes: "any" },
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      ],
      shortcut: "/brand/favicon.ico",
      apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website", siteName: "د. أحمد مرزوق", url: SITE.url,
      images: [{ url: process.env.NEXT_PUBLIC_OG_IMAGE || `${SITE.url}/brand/og-doctor.jpg` }],
    },
    twitter: {
      card: "summary_large_image",
      images: [process.env.NEXT_PUBLIC_OG_IMAGE || `${SITE.url}/brand/og-doctor.jpg`],
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
        <JsonLd data={siteGraph(l)} />
        <Analytics ga4={iv("integrations.ga4")} gtm={iv("integrations.gtm")} pixel={iv("integrations.metaPixel")} />
        <LangProvider lang={l}>
          <SettingsProvider initial={settings}>{children}</SettingsProvider>
        </LangProvider>
      </body>
    </html>
  );
}
