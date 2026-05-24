import { NextResponse } from "next/server";

export async function POST() {
     console.log("ACCESS KEY:", process.env.CENTRALBANK_ACCESS_KEY);
        const res = await fetch("https://api.loopland.se/identity-tokens", {
            method: "POST",
            headers: {
            "X-Access-Key": process.env.CENTRALBANK_ACCESS_KEY!,
        },
        });

  const data = await res.json();
  console.log("TOKEN RESPONSE:", data);
  
  return NextResponse.json(data);
}