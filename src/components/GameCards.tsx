import Link from "next/link";
import { GAME_CATALOG } from "@/lib/games/catalog";
import styles from "./GameCards.module.css";

export default function GameCards() {
  return (
    <ul className={styles.grid}>
      {GAME_CATALOG.map((game) => (
        <li key={game.href}>
          <Link
            href={game.href}
            className={styles.card}
            style={{ "--accent": game.accent } as React.CSSProperties}
          >
            <span className={styles.cardIcon} aria-hidden="true">
              {game.icon}
            </span>
            <h3>{game.name}</h3>
            <p>{game.description}</p>
            <dl className={styles.stats}>
              <div>
                <dt>Cost</dt>
                <dd>{game.cost}</dd>
              </div>
              <div>
                <dt>Prize</dt>
                <dd>{game.prize}</dd>
              </div>
            </dl>
            <span className={styles.play}>Play now →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
