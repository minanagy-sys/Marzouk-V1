import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import BlogPostView from "./BlogPostView";
import { getBlogPostsBi, getBlogPostBi, getBlogSlugsBi } from "@/lib/data/blogs";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getBlogSlugsBi();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBi(slug);
  if (!post) return { title: "Not found" };
  const title = post.title.ar;
  const description = post.excerpt.ar;
  const url = `${SITE.url}/blogs/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", siteName: SITE.nameAr },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBi(slug);
  if (!post) notFound();

  const all = await getBlogPostsBi();
  const related = all.filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title.en || post.title.ar,
    description: post.excerpt.en || post.excerpt.ar,
    url: `${SITE.url}/blogs/${slug}`,
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
