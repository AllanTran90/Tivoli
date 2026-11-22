import { useState, useEffect } from "react";
import { resolveIdentityToken } from "@/lib/loopland";
import { useWallet } from "@/context/WalletContext";
import { cleanPlayerName, MAX_PLAYER_NAME_LENGTH } from "@/lib/leaderboard";

interface GameSession {
  userName: string | null;
  playerName: string;
  setPlayerName: (name: string) => void;
  /** Sant när spelaren har skrivit ett namn. Krävs för spel med topplista. */
  hasPlayerName: boolean;
  bankError: string | null;
  setBankError: (error: string | null) => void;
}

const TOKEN_KEY = "loopland_identity_token";

function readSessionToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeSessionToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Privat läge eller blockerad lagring: token gäller då bara tills sidan laddas om.
  }
}

export function useGameSession(route: string): GameSession {
  const { identityToken, setIdentityToken } = useWallet();
  const [userName, setUserName] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [bankError, setBankError] = useState<string | null>(null);

  // Loopland skickar spelaren hit med ?identity_token=... Spara den i plånboken och i
  // sessionStorage (så att en omladdning inte tyst byter till gästbanken) och ta bort den från adressfältet.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("identity_token");
    if (fromUrl) {
      writeSessionToken(fromUrl);
      window.history.replaceState({}, "", route);
    }
    const token = fromUrl ?? readSessionToken();
    if (token) setIdentityToken(token);
  }, [route, setIdentityToken]);

  useEffect(() => {
    if (!identityToken) return;
    let cancelled = false;
    resolveIdentityToken(identityToken).then((data) => {
      if (cancelled || !data) return;
      setUserName(data.user.name);
      // Fyll i Loopland-namnet om spelaren inte redan har skrivit något.
      setPlayerName((current) => (current.trim() ? current : data.user.name.slice(0, MAX_PLAYER_NAME_LENGTH)));
    });
    return () => {
      cancelled = true;
    };
  }, [identityToken]);

  const hasPlayerName = cleanPlayerName(playerName) !== null;

  return { userName, playerName, setPlayerName, hasPlayerName, bankError, setBankError };
}
