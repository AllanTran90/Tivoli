type Props = {
  selected: number | null;
  onSelect: (num: number) => void;
};

export default function NumberPicker({ selected, onSelect }: Props) {
  return (
    <div>
      <p>Choose a number:</p>

      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button
          key={num}
          onClick={() => onSelect(num)}
          style={{
            margin: "5px",
            backgroundColor: selected === num ? "green" : "white",
          }}
        >
          {num}
        </button>
      ))}
    </div>
  );
}