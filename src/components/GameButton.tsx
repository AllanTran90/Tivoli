"use client";

import ui from "./ui.module.css";

type Props = {
  text: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
  onClick: () => void;
};

export default function GameButton({ text, disabled, variant = "primary", onClick, className }: Props) {
  const classes = [ui.button, variant === "secondary" && ui.secondary, className].filter(Boolean).join(" ");
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {text}
    </button>
  );
}
