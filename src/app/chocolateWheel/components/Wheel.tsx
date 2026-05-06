type Props = {
  rotation: number;
};

export default function Wheel({ rotation }: Props) {
  return (
    <div className="wheel-container">
      <div className="pointer">▼</div>

      <div
        className="wheel"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((num, i) => {
          const angle = i * 60;

          return (
            <span
              key={num}
              className="slice-text"
              style={{
                transform: `rotate(${angle}deg) translate(80px) rotate(-${angle}deg)`,
              }}
            >
              {num}
            </span>
          );
        })}
      </div>
    </div>
  );
}