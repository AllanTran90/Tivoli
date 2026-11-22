import confetti from "canvas-confetti";

export default function triggerWinConfetti(): void {
    confetti({
        particleCount: 150,
        spread: 120
    });
}