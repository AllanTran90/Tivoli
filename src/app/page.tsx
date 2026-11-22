import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import GameCards from "@/components/GameCards";
import { STARTING_BALANCE } from "@/lib/games/rules";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Step right up!</p>
          <h1 className={styles.title}>
            Welcome to <span>Tivoli Arcade</span>
          </h1>
          <p className={styles.lead}>
            Three neon classics, one wallet of hearts. Beat the clock, hit the bullseye or spin for
            chocolate, then put your name on the leaderboard.
          </p>
          <div className={styles.actions}>
            <Link href="#games" className={styles.primary}>
              Choose a game
            </Link>
            <Link href="/leaderboard" className={styles.secondary}>
              🏆 Leaderboard
            </Link>
          </div>
        </div>

        <div className={styles.heroImage}>
          <Image
            src="/images/tivoli-arcade.png"
            alt="Neon arcade with Reaction Rush, Darts and Chocolate Wheel machines"
            width={1536}
            height={1024}
            sizes="(min-width: 960px) 50vw, 100vw"
            preload
          />
        </div>
      </section>

      <section id="games" className={styles.games} aria-labelledby="games-title">
        <h2 id="games-title" className={styles.sectionTitle}>
          Pick your game
        </h2>
        <GameCards />
      </section>

      <section className={styles.info} aria-label="How hearts work">
        <div>
          <h3>❤️ New here?</h3>
          <p>You get {STARTING_BALANCE} free hearts to start with. Every game costs hearts, and winning gives you more.</p>
        </div>
        <div>
          <h3>🎟️ Coming from Loopland?</h3>
          <p>Your Loopland account is used automatically, so wins and losses go straight to your Loopland hearts.</p>
        </div>
      </section>
    </main>
  );
}
