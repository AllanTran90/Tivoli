"use client";

import BackToLoopland from "@/components/BackToLoopland";
import HowToPlay from "@/components/HowToPlay";
import History from "@/components/History";
import GameSessionBar from "@/components/GameSessionBar";
import BetInput from "@/components/BetInput";
import GameButton from "@/components/GameButton";
import Module from "@/app/reactionRush/reactionRush.module.css";
import { useReactionGame } from "@/hooks/useReactionGame";

const HOW_TO_STEPS = [
  "Press SPACE or Play to start",
  "Wait carefully",
  "Press SPACE or Stop at exactly 10.00",
  "10.00 gives +3 ❤️",
  "Within 0.1 gives +1 ❤️",
  "Otherwise you lose your bet",
  "Write your alias for a chance to enter the leaderboard 🏆",
];

export default function ReactionRushPage() {
  const { currentTime, time, isPlaying, bet, maxBet, setBet, history, balance, handleGame, reset, userName, bankError, playerName, setPlayerName } = useReactionGame();

  return (
    <main>
      <BackToLoopland />
      <div className={Module.container}>
        <div className={Module["center-panel"]}>
          <h1>⏱️ Reaction Rush</h1>
          <GameSessionBar userName={userName} bankError={bankError} playerName={playerName} setPlayerName={setPlayerName} />
          <p>Press SPACE to play</p>
          <br />
          <HowToPlay title="How To Play" steps={HOW_TO_STEPS} />
          <br />
          <h2>{currentTime.toFixed(2)}</h2>
          <BetInput bet={bet} max={maxBet} balance={balance} disabled={isPlaying} onChange={setBet} />
          <GameButton text={isPlaying ? "Stop" : "Play"} onClick={handleGame} />
          <GameButton text="Reset" onClick={reset} disabled={isPlaying} />
          {time !== null && (
            <div>
              <p>Your Time: {time.toFixed(2)}</p>
              <p>Difference: {Math.abs(10 - time).toFixed(2)}</p>
              <History items={history} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
