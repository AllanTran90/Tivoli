"use client";

type Props = {
  title?: string;
  items: string[];
};

export default function History({
  title = "History",
  items,
}: Props) {
  return (
    <div>
      <h2>{title}</h2>

      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}