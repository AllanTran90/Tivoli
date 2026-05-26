import GameButton from "@/components/GameButton";

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