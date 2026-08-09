"use server";

import { revalidatePath } from "next/cache";
import { sql, ensureSchema } from "@/lib/db";

function touchedPaths() {
  revalidatePath("/");
  revalidatePath("/maintenance");
  revalidatePath("/tambah-cepat");
}

export async function addMaintenanceItem(formData: FormData) {
  await ensureSchema();

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "rumah");
  const notes = String(formData.get("notes") || "").trim() || null;
  const lastServiceDate = String(formData.get("last_service_date") || "") || null;
  const nextReminderDate = String(formData.get("next_reminder_date") || "") || null;
  const userLabel = String(formData.get("user_label") || "").trim() || null;

  if (!title) return;
  if (category !== "rumah" && category !== "kendaraan") return;

  await sql`
    INSERT INTO maintenance_items (title, category, notes, last_service_date, next_reminder_date, user_label)
    VALUES (${title}, ${category}, ${notes}, ${lastServiceDate}, ${nextReminderDate}, ${userLabel});
  `;

  touchedPaths();
}

export async function deleteMaintenanceItem(formData: FormData) {
  await ensureSchema();
  const id = Number(formData.get("id"));
  if (!id) return;
  await sql`DELETE FROM maintenance_items WHERE id = ${id};`;
  touchedPaths();
}
