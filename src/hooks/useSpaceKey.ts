import { useEffect } from "react";

type UseSpaceKeyProps = {
  action: () => void;
};

export default function useSpaceKey({
  action,
}: UseSpaceKeyProps) {

  useEffect(() => {

    function handleKeyDown(
      event: KeyboardEvent
    ) {

      if (
        event.code === "Space" &&
        document.activeElement?.tagName !==
          "INPUT"
      ) {

        event.preventDefault();

        action();
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

  }, [action]);
}