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
  const title = pick(post.title, l);
  const description = pick(post.excerpt, l);
  const alternates = altLangs(l, `/blogs/${arSlug}`, `/blogs/${enSlug}`);
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical, type: "article", siteName: SITE.nameAr },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.en || post.title.ar,
    description: post.excerpt.en || post.excerpt.ar,
    url,
    inLanguage: l,
    datePublished: post.date,
    author: { "@type": "Physician", name: SITE.nameEn },
    publisher: { "@type": "Organization", name: SITE.nameEn },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogPostView post={post} related={related} />
    </>
  );
}
