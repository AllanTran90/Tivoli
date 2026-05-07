"use client";

type Props = {
  title: string;
  steps: string[];
};

export default function HowToPlay({
  title,
  steps,
}: Props) {
  return (
    <div>
      <h2>{title}</h2>

      {steps.map((step) => (
        <p key={step}>{step}</p>
      ))}
    </div>
  );
}