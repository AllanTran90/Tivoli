import styles from "../chocolateWheel.module.css";

type Props = {
  rotation: number;
};

const NUMBERS = [1, 2, 3, 4, 5, 6];

/**
 * Siffran n sitter mitt i sin tårtbit, (n - 1) * 60 + 90 grader medurs från toppen.
 * rotationFor() i useChocolateWheel räknar med just de vinklarna, så ändra dem tillsammans.
 */
export default function Wheel({ rotation }: Props) {
  return (
    <div className={styles.wheelContainer}>
      <div className={styles.pointer} aria-hidden="true" />
      <div className={styles.wheel} style={{ transform: `rotate(${rotation}deg)` }} aria-hidden="true">
        {NUMBERS.map((num) => {
          const angle = (num - 1) * 60 + 90;
          return (
            <span key={num} className={styles.slice} style={{ transform: `rotate(${angle}deg)` }}>
              <span className={styles.sliceText} style={{ transform: `rotate(${-angle}deg)` }}>
                {num}
              </span>
            </span>
          );
        })}
      </div>
      <div className={styles.hub} aria-hidden="true">
        🍫
      </div>
    </div>
  );
}
