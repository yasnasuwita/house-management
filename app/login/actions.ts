"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, checkPin, expectedSessionToken } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const pin = String(formData.get("pin") || "").trim();
  const ok = await checkPin(pin);

  if (!ok) {
    redirect("/login?error=1");
  }

  const token = await expectedSessionToken();
  if (!token) {
    redirect("/login?error=config");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  redirect("/");
}
