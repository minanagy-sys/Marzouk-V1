import { renderIndex, XML_HEADERS } from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

/** Sitemap index — links to one styled sub-sitemap per category. */
export async function GET() {
  return new Response(renderIndex(), { headers: XML_HEADERS });
}
