import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch(
    "https://api.loopland.se/identity-tokens",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "X-Access-Key":
          process.env.CENTRALBANK_ACCESS_KEY!,
      },
    }
  );

  const data = await res.json();

  console.log("TOKEN RESPONSE:", data);

  return NextResponse.json(data);
}