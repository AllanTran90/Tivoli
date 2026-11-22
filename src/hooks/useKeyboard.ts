import { useEffect, useRef } from "react";

/** Sant om användaren skriver i ett textfält, då ska spelets kortkommandon inte reagera. */
function isTyping(): boolean {
  const tag = document.activeElement?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Lyssnar på tangenter för hela fönstret. `handlers` mappar `event.code`
 * (t.ex. "Space", "ArrowUp") till en funktion. Ignorerar tangenter när man skriver i ett fält.
 */
export function useKeyboard(handlers: Record<string, () => void>): void {
  // Senaste handlers i en ref, så att lyssnaren inte behöver läggas till på nytt varje render.
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      const handler = ref.current[event.code];
      if (!handler || isTyping()) return;
      event.preventDefault();
      handler();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
