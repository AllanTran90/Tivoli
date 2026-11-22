import { MIN_BET } from "@/lib/games/rules";

type Props = {
  bet: number;
  max: number;
  balance: number | null;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export default function BetInput({ bet, max, balance, disabled, onChange }: Props) {
  return (
    <div>
      {balance !== null && <p>❤️ Lives: {balance}</p>}
      <label>
        Bet:{" "}
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
    </div>
  );
}
