"use server";

import { revalidatePath } from "next/cache";
import { sql, ensureSchema } from "@/lib/db";

function touchedPaths() {
  revalidatePath("/link-penting");
  revalidatePath("/tambah-cepat");
}

function normalizeUrl(url: string): string {
  if (!/^https?:\/\//i.test(url)) return `https://${url}`;
  return url;
}

export async function addLink(formData: FormData) {
  await ensureSchema();

  const title = String(formData.get("title") || "").trim();
  let url = String(formData.get("url") || "").trim();
  const category = String(formData.get("category") || "").trim() || null;
  const notes = String(formData.get("notes") || "").trim() || null;
  const userLabel = String(formData.get("user_label") || "").trim() || null;

  if (!title || !url) return;
  url = normalizeUrl(url);

  await sql`
    INSERT INTO important_links (title, url, category, notes, user_label)
    VALUES (${title}, ${url}, ${category}, ${notes}, ${userLabel});
  `;

  touchedPaths();
}

export async function deleteLink(formData: FormData) {
  await ensureSchema();
  const id = Number(formData.get("id"));
  if (!id) return;
  await sql`DELETE FROM important_links WHERE id = ${id};`;
  touchedPaths();
}
