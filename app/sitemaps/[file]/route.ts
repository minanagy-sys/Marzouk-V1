import { entriesFor, renderUrlset, XML_HEADERS } from "@/lib/sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

/** One category sub-sitemap, e.g. /sitemaps/services.xml */
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const entries = await entriesFor(file);
  if (!entries) return new Response("Not found", { status: 404 });
  return new Response(renderUrlset(entries), { headers: XML_HEADERS });
}
