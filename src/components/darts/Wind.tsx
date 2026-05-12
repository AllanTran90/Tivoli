type Props = {
  wind: string;
};

export default function Wind({
  wind,
}: Props) {
  return (
    <div
      style={{
        background: "#1e1e1e",
        padding: "12px",
        borderRadius: "12px",
        fontSize: "20px",
      }}
    >
       Wind: {wind}
    </div>
  );
}