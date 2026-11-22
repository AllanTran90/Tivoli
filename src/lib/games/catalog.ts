// Visningsinfo för spelen (namn, ikon, färg). Används av startsidan, /games och spelsidorna.

import { CHOCOLATE_WHEEL_COST, DARTS_COST, MIN_BET } from "./rules";

export interface GameInfo {
  href: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  cost: string;
  prize: string;
  accent: string;
}

export const REACTION_RUSH: GameInfo = {
  href: "/reactionRush",
  icon: "⏱️",
  name: "Reaction Rush",
  tagline: "Stop the clock at exactly 10.00 seconds.",
  description: "Stop the clock at exactly 10.00 seconds. Nerves of steel required.",
  cost: `From ${MIN_BET} ❤️`,
  prize: "Up to +3 ❤️",
  accent: "#a855f7",
};

export const DARTS: GameInfo = {
  href: "/darts",
  icon: "🎯",
  name: "Darts",
  tagline: "Three darts, shifting wind. Aim for 150.",
  description: "Three darts, shifting wind. Score 150 or more for the big prize.",
  cost: `${DARTS_COST} ❤️`,
  prize: "Up to +10 ❤️",
  accent: "#3b82f6",
};

export const CHOCOLATE_WHEEL: GameInfo = {
  href: "/chocolateWheel",
  icon: "🍫",
  name: "Chocolate Wheel",
  tagline: "Pick a number and spin for chocolate.",
  description: "Pick a lucky number, spin the wheel and hope it stops on yours.",
  cost: `${CHOCOLATE_WHEEL_COST} ❤️`,
  prize: "+2 ❤️",
  accent: "#ec4899",
};

export const GAME_CATALOG = [REACTION_RUSH, DARTS, CHOCOLATE_WHEEL];
