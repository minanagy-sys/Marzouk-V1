import type { Metadata } from "next";
import BlogsView from "./BlogsView";
import { getBlogPostsBi, getBlogCategories } from "@/lib/data/blogs";
import { SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const l: "ar" | "en" = lang === "en" ? "en" : "ar";
  return pageMetadata({
    page: "blogs", lang: l, arPath: "/blogs", enPath: "/blogs",
    defTitleAr: "المدونة ومعلومات طبية", defTitleEn: "Blog & Medical Info",
    defDesc: "معلومات طبية موثوقة حول الولادة بدون ألم، الأورام الليفية، بطانة الرحم المهاجرة، ومتابعة الحمل من د. أحمد مرزوق.",
  });
}

export default async function BlogsPage() {
  const [posts, categories] = await Promise.all([getBlogPostsBi(), getBlogCategories()]);
  return <BlogsView posts={posts} categories={categories} />;
}
