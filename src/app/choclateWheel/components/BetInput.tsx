type Props = {
  bet: number;
  balance: number;
  onChange: (value: number) => void;
};

export default function BetInput({ bet, balance, onChange }: Props) {
  return (
    <div>
      <p>💰 Balance: {balance}€</p>

      <input
        type="number"
        value={bet}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}