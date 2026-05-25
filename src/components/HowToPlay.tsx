"use client";

type Props = {
  title: string;
  steps: string[];
};

export default function HowToPlay({ title, steps }: Props) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </section>
  );
}