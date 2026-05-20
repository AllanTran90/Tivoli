import GameButton from "@/components/Gamebutton";

type ThrowButtonProps = {
    onThrow: () => void;
};


export default function ThrowButton({
  onThrow,
}: ThrowButtonProps) {

  return (
    <GameButton
      text="Throw Dart"
      onClick={onThrow}
    />
  );
}