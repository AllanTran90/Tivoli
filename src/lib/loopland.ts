const LOOPLAND_API = "https://api.loopland.se";

export async function resolveIdentityToken(token: string): Promise<{ user: { id: number; name: string } } | null> {
  try {
    const res = await fetch(`${LOOPLAND_API}/identity-tokens/${token}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
