import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = await request.json() as { accessKey: string };

  const res = await fetch("https://api.loopland.se/identity-tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_key: body.accessKey }),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
