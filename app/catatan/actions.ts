"use server";

import { revalidatePath } from "next/cache";
import { sql, ensureSchema } from "@/lib/db";

function touchedPaths() {
  revalidatePath("/catatan");
}

export async function addTodoItem(formData: FormData) {
  await ensureSchema();

  const title = String(formData.get("title") || "").trim();
  const userLabel = String(formData.get("user_label") || "").trim() || null;

  if (!title) return;

  await sql`
    INSERT INTO todo_items (title, user_label)
    VALUES (${title}, ${userLabel});
  `;

  touchedPaths();
}

export async function toggleTodoItem(formData: FormData) {
  await ensureSchema();
  const id = Number(formData.get("id"));
  const isDone = String(formData.get("is_done")) === "true";
  if (!id) return;
  await sql`UPDATE todo_items SET is_done = ${!isDone} WHERE id = ${id};`;
  touchedPaths();
}

export async function deleteTodoItem(formData: FormData) {
  await ensureSchema();
  const id = Number(formData.get("id"));
  if (!id) return;
  await sql`DELETE FROM todo_items WHERE id = ${id};`;
  touchedPaths();
}
