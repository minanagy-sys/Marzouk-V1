import type { Metadata } from "next";
import BlogsView from "./BlogsView";
import { getBlogPostsBi } from "@/lib/data/blogs";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "المدونة ومعلومات طبية — Blog",
  description:
    "معلومات طبية موثوقة حول الولادة بدون ألم، الأورام الليفية، بطانة الرحم المهاجرة، ومتابعة الحمل من د. أحمد مرزوق.",
  alternates: { canonical: `${SITE.url}/blogs` },
};

export default async function BlogsPage() {
  const posts = await getBlogPostsBi();
  return <BlogsView posts={posts} />;
}
