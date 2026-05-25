type Props = {
  bet: number;
  balance: number;
  onChange: (value: number) => void;
};

export default function BetInput({
  bet,
  balance,
  onChange,
}: Props) {
  return (
    <div>
      <p>❤️ Lives: {balance}</p>

      <input
        type="number"
        min={1}
        max={balance}
        value={bet}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
      />
    </div>
  );
}