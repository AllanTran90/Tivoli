import { useEffect } from "react";

type UseKeyboardAimProps = {

  setAimX: React.Dispatch<
    React.SetStateAction<number>
  >;

  setAimY: React.Dispatch<
    React.SetStateAction<number>
  >;

  onThrow: () => void;
};

export function useKeyboardAim({
  setAimX,
  setAimY,
  onThrow,
}: UseKeyboardAimProps) {

  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (event.key === "ArrowUp") {
        setAimY((prev) => prev - 10);
      }

      if (event.key === "ArrowDown") {
        setAimY((prev) => prev + 10);
      }

      if (event.key === "ArrowLeft") {
        setAimX((prev) => prev - 10);
      }

      if (event.key === "ArrowRight") {
        setAimX((prev) => prev + 10);
      }

      if (event.code === "Space") {

        event.preventDefault();

        onThrow();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [
    setAimX,
    setAimY,
    onThrow,
  ]);
}