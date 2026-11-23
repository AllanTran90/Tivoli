import { useEffect, useRef } from "react";

/**
 * Sant om tangenten ska gå till ett formulärfält i stället för till spelet.
 * - Textfält: allt går till fältet (man ska kunna skriva "Allan Tran" med mellanslag).
 * - Sifferfält (t.ex. insatsen): pilarna ändrar siffran, men mellanslag går till spelet,
 *   eftersom man ändå inte kan skriva mellanslag i ett sifferfält.
 */
function belongsToField(code: string): boolean {
  const el = document.activeElement;
  if (!el) return false;
  if (el instanceof HTMLInputElement && el.type === "number") return code !== "Space";
  return el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
}

/**
 * Lyssnar på tangenter för hela fönstret. `handlers` mappar `event.code`
 * (t.ex. "Space", "ArrowUp") till en funktion.
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
      if (!handler || belongsToField(event.code)) return;
      // Annars klickar mellanslag även på knappen som har fokus, och sidan scrollar.
      event.preventDefault();
      // Håller man inne mellanslag ska det bli ett kast, inte tjugo. Pilarna får upprepas.
      if (event.code === "Space" && event.repeat) return;
      handler();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
