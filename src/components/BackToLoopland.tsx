"use client";

export default function BackToLoopland() {
  return (
    <button
      style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
      }}
      onClick={() =>
        window.parent.postMessage(
          {
            type: "AMUSEMENT_CLOSE",
          },
          "*"
        )
      }
    >
      Back to Loopland
    </button>
  );
}