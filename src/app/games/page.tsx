import GameCards from "@/components/GameCards";
import styles from "@/components/PageShell.module.css";

export default function GamesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>🕹️ Games</h1>
        <p className={styles.lead}>Three machines, one wallet. Pick one and good luck!</p>
      </header>
      <GameCards />
    </main>
  );
}
