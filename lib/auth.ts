export const SESSION_COOKIE = "house_session";
const SALT = "house-management-v1";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string | null> {
  const pin = process.env.APP_PIN;
  if (!pin) return null;
  return sha256Hex(`${SALT}:${pin}`);
}

export async function checkPin(pin: string): Promise<boolean> {
  const appPin = process.env.APP_PIN;
  if (!appPin) return false;
  return pin === appPin;
}

export function userLabels(): [string, string] {
  return [
    process.env.USER1_LABEL?.trim() || "Saya",
    process.env.USER2_LABEL?.trim() || "Suami",
  ];
}
