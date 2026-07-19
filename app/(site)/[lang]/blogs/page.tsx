import type { Metadata } from "next";
import BlogsView from "./BlogsView";
import { getBlogPostsBi, getBlogCategories } from "@/lib/data/blogs";
import { SITE } from "@/lib/site";
import { altLangs } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return {
  title: "المدونة ومعلومات طبية — Blog",
  description:
    "معلومات طبية موثوقة حول الولادة بدون ألم، الأورام الليفية، بطانة الرحم المهاجرة، ومتابعة الحمل من د. أحمد مرزوق.",
  alternates: altLangs(l, "/blogs", "/blogs"),
  };
}

export default async function BlogsPage() {
  const [posts, categories] = await Promise.all([getBlogPostsBi(), getBlogCategories()]);
  return <BlogsView posts={posts} categories={categories} />;
}
