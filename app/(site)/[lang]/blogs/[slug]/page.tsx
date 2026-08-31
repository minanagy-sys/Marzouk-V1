import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import BlogPostView from "./BlogPostView";
import { getBlogPostsBi, getBlogPostBi, getBlogParams } from "@/lib/data/blogs";
import { pick, slugFor, type Lang } from "@/lib/data/types";
import { altLangs } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = true; // Arabic slugs render on-demand

export async function generateStaticParams() {
  return getBlogParams();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const post = await getBlogPostBi(slug);
  if (!post) return { title: "Not found" };
  const arSlug = post.slugAr || post.slug;
  const enSlug = post.slugEn || post.slug;
  const title = (post.metaTitle && pick(post.metaTitle, l)) || pick(post.title, l);
  const description = (post.metaDesc && pick(post.metaDesc, l)) || pick(post.excerpt, l);
  const keywords = post.keywords ? pick(post.keywords, l) : "";
  const alternates = altLangs(l, `/blogs/${arSlug}`, `/blogs/${enSlug}`);
  const ogImage = post.imageUrl ? (post.imageUrl.startsWith("http") ? post.imageUrl : `${SITE.url}${post.imageUrl}`) : undefined;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates,
    openGraph: {
      title, description, url: alternates.canonical, type: "article", siteName: SITE.nameAr,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(ogImage ? { images: [ogImage] } : {}) },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const l: Lang = lang === "en" ? "en" : "ar";
  const post = await getBlogPostBi(slug);
  if (!post) notFound();

  const all = await getBlogPostsBi();
  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const url = `${SITE.url}/${l}/blogs/${slugFor(post, l)}`;

  const ogImage = post.imageUrl ? (post.imageUrl.startsWith("http") ? post.imageUrl : `${SITE.url}${post.imageUrl}`) : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": post.schemaType || "BlogPosting",
    headline: pick(post.title, l),
    description: pick(post.excerpt, l),
    url,
    inLanguage: l,
    datePublished: post.date || undefined,
    ...(ogImage ? { image: ogImage } : {}),
    author: { "@type": "Physician", name: SITE.nameEn },
    publisher: { "@type": "Organization", name: SITE.nameEn },
    mainEntityOfPage: url,
  };

  // Breadcrumb trail for rich results.
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE.nameEn, item: `${SITE.url}/${l}` },
      { "@type": "ListItem", position: 2, name: l === "ar" ? "المدونة" : "Blog", item: `${SITE.url}/${l}/blogs` },
      { "@type": "ListItem", position: 3, name: pick(post.title, l), item: url },
    ],
  };

  // FAQ schema (only when the post has FAQs).
  const faqLd = post.faq && post.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: pick(f.q, l),
          acceptedAnswer: { "@type": "Answer", text: pick(f.a, l) },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />
      {faqLd && <JsonLd data={faqLd} />}
      <BlogPostView post={post} related={related} />
    </>
  );
}
