import styles from "@/app/darts/darts.module.css";

type Props = {
  score: number;
  throwsLeft: number;
  wind: string;
};

export default function InfoBar({ score, throwsLeft, wind }: Props) {
  return (
    <div className={styles.infoBar}>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Score</span>
        <span className={styles.infoValue}>{score}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Throw Left</span>
        <span className={styles.infoValue}>{throwsLeft}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Wind</span>
        <span className={styles.infoValue}>{wind}</span>
      </div>
    </div>
  );
}