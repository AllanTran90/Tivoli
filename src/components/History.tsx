import ui from "./ui.module.css";

type Props = {
  title?: string;
  items: string[];
};

export default function History({ title = "History", items }: Props) {
  return (
    <section className={ui.panel} aria-label={title}>
      <h2 className={ui.panelTitle}>{title}</h2>
      {items.length === 0 ? (
        <p className={ui.empty}>Nothing here yet. Go play!</p>
      ) : (
        <ul className={`${ui.list} ${ui.history}`}>
          {items.map((item, index) => (
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
