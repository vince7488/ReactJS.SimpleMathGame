import type { GameStatus } from "../types/game";

interface ResetGameProps {
  gameStatus: Exclude<GameStatus, "active">;
  onClick: () => void;
}

export function ResetGame({ gameStatus, onClick }: ResetGameProps) {
  return (
    <div className="game-end-container">
      <span
        className={`game-end-stat ${gameStatus === "lost" ? "islost" : "iswon"}`}
      >
        {gameStatus === "lost" ? "Game Over." : "Great!"}
      </span>
      <button type="reset" onClick={onClick}>
        Play Again?
      </button>
    </div>
  );
}
