"use server";

import { revalidatePath } from "next/cache";
import { sql, ensureSchema } from "@/lib/db";

function touchedPaths() {
  revalidatePath("/");
  revalidatePath("/keuangan");
  revalidatePath("/laporan");
  revalidatePath("/tambah-cepat");
}

export async function addTransaction(formData: FormData) {
  await ensureSchema();

  const type = String(formData.get("type") || "expense");
  const amount = Number(formData.get("amount") || 0);
  const category = String(formData.get("category") || "Lainnya").trim() || "Lainnya";
  const description = String(formData.get("description") || "").trim() || null;
  const userLabel = String(formData.get("user_label") || "").trim() || null;
  const occurredOn = String(formData.get("occurred_on") || "") || new Date().toISOString().slice(0, 10);

  if (!amount || amount <= 0) return;
  if (type !== "income" && type !== "expense") return;

  await sql`
    INSERT INTO transactions (type, amount, category, description, user_label, occurred_on)
    VALUES (${type}, ${amount}, ${category}, ${description}, ${userLabel}, ${occurredOn});
  `;

  touchedPaths();
}

export async function deleteTransaction(formData: FormData) {
  await ensureSchema();
  const id = Number(formData.get("id"));
  if (!id) return;
  await sql`DELETE FROM transactions WHERE id = ${id};`;
  touchedPaths();
}
