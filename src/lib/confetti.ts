import confetti from "canvas-confetti";

export default function triggerWinConfetti(){
    confetti({
        particleCount: 150,
        spread: 120
    });
}