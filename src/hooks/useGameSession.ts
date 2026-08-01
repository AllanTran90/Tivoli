import { useState, useEffect } from "react";
import { resolveIdentityToken } from "@/lib/loopland";

interface GameSession {
  identityToken: string | null;
  userName: string | null;
  playerName: string;
  setPlayerName: (name: string) => void;
  bankError: string | null;
  setBankError: (error: string | null) => void;
}

export function useGameSession(route: string): GameSession {
  const [identityToken, setIdentityToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [bankError, setBankError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("identity_token");

    if (token) {
      setIdentityToken(token);
      window.history.replaceState({}, "", route);

      resolveIdentityToken(token).then((data) => {
        if (data) setUserName(data.user.name);
      });
    }
  }, [route]);

  return { identityToken, userName, playerName, setPlayerName, bankError, setBankError };
}
