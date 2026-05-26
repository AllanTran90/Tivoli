import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {

  const body =
    await request.json();

  const res = await fetch(
    "https://api.loopland.se/identity-tokens",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        access_key:
          body.accessKey,
      }),
    }
  );

  
  const data = await res.json();
  console.log(data);

  return NextResponse.json(data);
}