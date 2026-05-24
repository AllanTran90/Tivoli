"use client";

type Props = {
  title: string;
  steps: string[];
};

export default function HowToPlay({ title, steps }: Props) {
  return (
    <section aria-label={title}>
      <h2>{title}</h2>
      <ol>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}