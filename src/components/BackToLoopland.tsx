"use client";

import styles from "./BackToLoopland.module.css";

export default function BackToLoopland() {
  function handleBack() {
    window.parent.postMessage(
      { type: "AMUSEMENT_CLOSE" },
      "*"
    );

    window.location.href = "https://loopland.se";
  }

  return (
    <button
      className={styles.backButton}
      onClick={handleBack}
    >
      Back to Loopland
    </button>
  );
}