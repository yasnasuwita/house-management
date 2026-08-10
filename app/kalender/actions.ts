"use server";

import { revalidatePath } from "next/cache";
import { sql, ensureSchema } from "@/lib/db";

function touchedPaths() {
  revalidatePath("/");
  revalidatePath("/kalender");
}

export async function addCalendarEvent(formData: FormData) {
  await ensureSchema();

  const title = String(formData.get("title") || "").trim();
  const eventDate = String(formData.get("event_date") || "");
  const notes = String(formData.get("notes") || "").trim() || null;
  const userLabel = String(formData.get("user_label") || "").trim() || null;

  if (!title || !eventDate) return;

  await sql`
    INSERT INTO calendar_events (title, notes, event_date, user_label)
    VALUES (${title}, ${notes}, ${eventDate}, ${userLabel});
  `;

  touchedPaths();
}

export async function deleteCalendarEvent(formData: FormData) {
  await ensureSchema();
  const id = Number(formData.get("id"));
  if (!id) return;
  await sql`DELETE FROM calendar_events WHERE id = ${id};`;
  touchedPaths();
}
