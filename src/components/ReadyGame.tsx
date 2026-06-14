import type { ChangeEvent } from 'react';
import type { DifficultyLevel } from '../types/game';
import { DIFFICULTY_SECONDS } from '../utils/game';

interface ReadyGameProps {
  difficulty: DifficultyLevel;
  onDifficultyChange: (level: DifficultyLevel) => void;
  onClick: () => void;
}

export function ReadyGame({
  difficulty,
  onDifficultyChange,
  onClick,
}: ReadyGameProps) {
  const handleDifficultyChange = (event: ChangeEvent<HTMLInputElement>) => {
    onDifficultyChange(Number(event.currentTarget.value) as DifficultyLevel);
  };

  return (
    <div className="game-end-container">
      <span className="game-end-stat isready">Ready to Start?</span>
      <div className="difficulty-control">
        <label htmlFor="difficulty">Difficulty</label>
        <input
          aria-valuetext={`Level ${difficulty}, ${DIFFICULTY_SECONDS[difficulty]} seconds`}
          className="difficulty-slider"
          id="difficulty"
          max="7"
          min="1"
          onChange={handleDifficultyChange}
          step="1"
          type="range"
          value={difficulty}
        />
        <div aria-hidden="true" className="difficulty-labels">
          <span>Easy</span>
          <span>Hard</span>
        </div>
      </div>
      <button aria-keyshortcuts="Enter" type="button" onClick={onClick}>
        Start game <kbd>Enter</kbd>
      </button>
    </div>
  );
}
