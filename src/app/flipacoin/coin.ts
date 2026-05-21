
export type CoinSide = "heads" | "tails";

export class Coin {
  flip(): CoinSide {
    return Math.random() < 0.5 ? "heads" : "tails";
  }
}
