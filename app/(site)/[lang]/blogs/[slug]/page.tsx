import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import BlogPostView from "./BlogPostView";
import { getBlogPostsBi, getBlogPostBi, getBlogParams } from "@/lib/data/blogs";
import { pick, slugFor, type Lang } from "@/lib/data/types";
import { altLangs, stripBrand } from "@/lib/seo";
import { blogGraph } from "@/lib/schema";
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
  const title = stripBrand((post.metaTitle && pick(post.metaTitle, l)) || pick(post.title, l));
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

  // Single @graph: MedicalWebPage (about→MedicalCondition, author→Physician) +
  // BreadcrumbList + FAQPage. No reviewedBy until a real reviewer is assigned.
  const jsonLd = blogGraph(l, post, url, l === "ar" ? "المدونة" : "Blog");

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogPostView post={post} related={related} />
    </>
  );
}
