import "server-only";
import { cookies } from "next/headers";

// Gästkonto: ett slumpat id i en httpOnly-cookie. Klienten kan inte läsa eller
// sätta det via JavaScript, och servern godtar bara id:n i UUID-format.

export const GUEST_COOKIE = "tivoli_guest";
const ONE_YEAR = 60 * 60 * 24 * 365;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isValidGuestId(value: string | undefined): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

/** Hämtar gästens konto-id och skapar ett nytt om det saknas eller är ogiltigt. */
export async function getOrCreateGuestId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(GUEST_COOKIE)?.value;
  if (isValidGuestId(existing)) return existing;

  const id = crypto.randomUUID();
  store.set(GUEST_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
  return id;
}

/** Konto-id i Tivoli-banken. Prefix så att gäst-id:n aldrig krockar med andra id-typer. */
export function guestAccountId(guestId: string): string {
  return `guest:${guestId}`;
}
