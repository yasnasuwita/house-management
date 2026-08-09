"use server";

import { redirect } from "next/navigation";
import { addTransaction } from "../keuangan/actions";
import { addMaintenanceItem } from "../maintenance/actions";
import { addCalendarEvent } from "../kalender/actions";
import { addLink } from "../link-penting/actions";

export async function quickAdd(formData: FormData) {
  const kind = String(formData.get("kind") || "");

  if (kind === "keuangan") {
    await addTransaction(formData);
  } else if (kind === "maintenance") {
    await addMaintenanceItem(formData);
  } else if (kind === "kalender") {
    await addCalendarEvent(formData);
  } else if (kind === "link") {
    await addLink(formData);
  } else {
    return;
  }

  redirect("/tambah-cepat?success=1");
}
