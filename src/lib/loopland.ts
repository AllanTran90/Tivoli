import type { IdentityTokenResponse } from "@/types/api";

const LOOPLAND_API = "https://api.loopland.se";

export async function resolveIdentityToken(
  token: string
): Promise<IdentityTokenResponse | null> {
  try {
    const res = await fetch(`${LOOPLAND_API}/identity-tokens/${token}`);
    if (!res.ok) return null;
    return res.json() as Promise<IdentityTokenResponse>;
  } catch {
    return null;
  }
}
