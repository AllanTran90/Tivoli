import ui from "./ui.module.css";
import { MIN_BET } from "@/lib/games/rules";

type Props = {
  bet: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export default function BetInput({ bet, max, disabled, onChange }: Props) {
  return (
    <label className={ui.field}>
      Your bet (❤️ {MIN_BET}–{max})
      <input
        type="number"
        inputMode="numeric"
        min={MIN_BET}
        max={max}
        step={1}
        value={bet}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
