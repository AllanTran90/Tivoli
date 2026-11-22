import ui from "./ui.module.css";

type Props = {
  title?: string;
  steps: string[];
};

export default function HowToPlay({ title = "How to play", steps }: Props) {
  return (
    <section className={ui.panel} aria-label={title}>
      <h2 className={ui.panelTitle}>{title}</h2>
      <ol className={`${ui.list} ${ui.steps}`}>
        {steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
