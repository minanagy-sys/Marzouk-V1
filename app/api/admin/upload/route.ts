import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";
import { saveUpload } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Saves an uploaded image to disk (Hostinger) and returns its public URL. */
export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });

  try {
    const url = await saveUpload(file);
    return NextResponse.json({ url });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "upload_failed" }, { status: 500 });
  }
}
