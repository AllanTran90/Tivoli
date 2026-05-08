import DartBoard from "@/components/darts/DartBoard";

export default function DartsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DartBoard />
    </main>
  );
}