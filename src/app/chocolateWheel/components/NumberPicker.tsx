import styles from "../chocolateWheel.module.css";

type Props = {
  selected: number | null;
  onSelect: (num: number) => void;
};

export default function NumberPicker({ selected, onSelect }: Props) {
  return (
    <div role="group" aria-label="Choose a number">
      <p>Choose a number:</p>
      <div className={styles.numberGrid}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => onSelect(num)}
            aria-pressed={selected === num}
            aria-label={`Number ${num}`}
            className={`${styles.numberButton} ${selected === num ? styles.selected : ""}`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}