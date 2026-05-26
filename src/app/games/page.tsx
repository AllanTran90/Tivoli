"use client";

import { useRouter } from "next/navigation";

export default function GamePage() {
  const router = useRouter();

 async function goToGame(
  game: string
) {

  const accessKey = process.env.NEXT_PUBLIC_ACCESS_KEY;

  console.log(
    "ACCESS KEY:",
    accessKey
  );

  const res = await fetch(
    "/api/token",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        accessKey,
      }),
    }
  );

  const data =
    await res.json();

  console.log(data);

  const token =
    data.identity_token;

  router.push(
    `/${game}?identity_token=${token}`
  );
}
  return (
    <main>
      <h1>Games</h1>

      <button onClick={() => goToGame("chocolateWheel")}>
        Chocolate Wheel
      </button>
      <button onClick={() => goToGame("reactionRush")}>Reaction Rush</button>
      <button onClick={() => goToGame("darts")}>Darts</button>
    </main>
  );
}
