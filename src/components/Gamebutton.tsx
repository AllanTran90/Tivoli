"use client";

import styles from "./GameButton.module.css";

type Props = {
  text: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
};

export default function GameButton({ text, disabled, onClick, className }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${className ?? ""}`}
    >
      {text}
    </button>
  );
}