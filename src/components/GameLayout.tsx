import BackToLoopland from "./BackToLoopland";
import GameSessionBar from "./GameSessionBar";
import styles from "./GameLayout.module.css";

type Props = {
  icon: string;
  title: string;
  tagline: string;
  /** Spelets färg, används för rubrik och ram runt spelytan. */
  accent: string;
  /** Själva spelet. */
  children: React.ReactNode;
  /** Instruktioner, historik o.s.v. Hamnar till höger på desktop och under spelet på mobil. */
  sidebar: React.ReactNode;
  /** Spelet har en topplista, så visa fältet för spelarnamn. */
  hasLeaderboard?: boolean;
  userName: string | null;
  bankError: string | null;
  playerName: string;
  setPlayerName: (name: string) => void;
};

export default function GameLayout({
  icon,
  title,
  tagline,
  accent,
  children,
  sidebar,
  hasLeaderboard = true,
  userName,
  bankError,
  playerName,
  setPlayerName,
}: Props) {
  const session = { userName, bankError, playerName, setPlayerName };
  return (
    <main className={styles.page} style={{ "--accent": accent } as React.CSSProperties}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span aria-hidden="true">{icon}</span> {title}
          </h1>
          <p className={styles.tagline}>{tagline}</p>
        </div>
        <BackToLoopland />
      </header>

      <div className={styles.layout}>
        <section className={styles.stage} aria-label={title}>
          {children}
        </section>

        <aside className={styles.sidebar}>
          <GameSessionBar {...session} showNameInput={hasLeaderboard} />
          {sidebar}
        </aside>
      </div>
    </main>
  );
}
