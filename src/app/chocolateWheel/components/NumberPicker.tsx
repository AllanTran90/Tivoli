import styles from "../chocolateWheel.module.css";

type Props = {
  selected: number | null;
  onSelect: (num: number) => void;
};

export default function NumberPicker({ selected, onSelect }: Props) {
  return (
    <fieldset className={styles.picker}>
      <legend>Choose your number</legend>
      <div className={styles.numberGrid}>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onSelect(num)}
            aria-pressed={selected === num}
            aria-label={`Number ${num}`}
            className={styles.numberButton}
          >
            {num}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
