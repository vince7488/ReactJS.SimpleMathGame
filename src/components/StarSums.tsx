import { useEffect, useEffectEvent, useState } from "react";
import { useGameState } from "../hooks/useGameState";
import type { ButtonStatus, GameStatus } from "../types/game";
import { NUMBER_PAD_ORDER, sum } from "../utils/game";
import { NumberButton } from "./NumberButton";
import { ResetGame } from "./ResetGame";
import { Stars } from "./Stars";

interface StarSumsProps {
  startNewSession: () => void;
}

export function StarSums({ startNewSession }: StarSumsProps) {
  const [feedback, setFeedback] = useState(
    "Choose one or more numbers to match the stars.",
  );
  const {
    availableNumbers,
    countdown,
    selectedNumbers,
    starCount,
    updateGameState,
  } = useGameState();

  const hasWrongSum = sum(selectedNumbers) > starCount;
  const isAlmostOutOfTime =
    countdown <= 3 && countdown > 0 && availableNumbers.length > 0;
  const gameStatus: GameStatus =
    availableNumbers.length === 0 ? "win" : countdown <= 0 ? "lost" : "active";

  const currentNumberStatus = (number: number): ButtonStatus => {
    if (!availableNumbers.includes(number)) {
      return "used";
    }

    if (selectedNumbers.includes(number)) {
      return hasWrongSum ? "wrong" : "temp";
    }

    return "available";
  };

  const handleNumberClick = (number: number, status: ButtonStatus) => {
    if (gameStatus !== "active") {
      return;
    }

    if (status === "used") {
      setFeedback(`Number ${number} has already been used.`);
      return;
    }

    const newSelectedNumbers =
      status === "available"
        ? [...selectedNumbers, number]
        : selectedNumbers.filter((selectedNumber) => selectedNumber !== number);

    const selectedTotal = sum(newSelectedNumbers);

    if (selectedTotal === starCount) {
      setFeedback("Correct. Those numbers are now used.");
    } else if (selectedTotal > starCount) {
      setFeedback(
        `Too high: ${selectedTotal}. Deselect a number and try again.`,
      );
    } else if (selectedTotal > 0) {
      setFeedback(`Selected total: ${selectedTotal}. Target: ${starCount}.`);
    } else {
      setFeedback("Selection cleared.");
    }

    updateGameState(newSelectedNumbers);
  };

  const clearSelection = () => {
    if (gameStatus !== "active" || selectedNumbers.length === 0) {
      return;
    }

    updateGameState([]);
    setFeedback("Selection cleared.");
  };

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (/^[1-9]$/.test(event.key)) {
      document
        .querySelector<HTMLButtonElement>(`[data-number="${event.key}"]`)
        ?.click();
    } else if (event.key === "Escape") {
      clearSelection();
    } else if (event.key.toLowerCase() === "r" && gameStatus !== "active") {
      startNewSession();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="app-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">
            Quick sums · nine numbers · ten seconds · by{" "}
            <a
              href="https://vernard.net"
              target="_blank"
              rel="noopener indexer"
            >
              Vernard Mercader
            </a>
          </p>
          <h1>
            Star <em>Sum</em>
          </h1>
        </div>
        <a
          className="source-link"
          href="https://github.com/vince7488/ReactJS.SimpleMathGame"
          target="_blank"
          rel="noreferrer noopener"
        >
          View source
        </a>
      </header>
      <main className="game-board">
        <section
          className="game-panel target-panel"
          aria-labelledby="target-title"
        >
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Your target</p>
              <h2 aria-live="polite" id="target-title">
                {gameStatus === "active"
                  ? `${starCount} ${starCount === 1 ? "star" : "stars"}`
                  : "Round complete"}
              </h2>
            </div>
            <div
              aria-label={`${countdown} seconds remaining`}
              className={`timer ${isAlmostOutOfTime ? "almost-up" : ""}`}
              role="timer"
            >
              <span className="timer-label">Time Remaining:</span>
              <strong>{countdown}</strong>
              <small>sec</small>
            </div>
          </div>
          <div className="stars-stage">
            {gameStatus === "active" ? (
              <Stars count={starCount} />
            ) : (
              <ResetGame gameStatus={gameStatus} onClick={startNewSession} />
            )}
          </div>
        </section>

        <section
          className="game-panel numbers-panel"
          aria-labelledby="numbers-title"
        >
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Build the sum</p>
              <h2 id="numbers-title">Choose numbers</h2>
            </div>
            <p className="keyboard-note">
              Tap or press <kbd>1</kbd>&endash;<kbd>9</kbd>
            </p>
          </div>
          <div className="number-grid">
            {NUMBER_PAD_ORDER.map((number) => (
              <NumberButton
                key={number}
                disabled={gameStatus !== "active"}
                number={number}
                status={currentNumberStatus(number)}
                onClick={handleNumberClick}
              />
            ))}
          </div>
          <div className="selection-bar">
            <p aria-live="polite" className="feedback" role="status">
              {feedback}
            </p>
            <button
              aria-keyshortcuts="Escape"
              className="clear-button"
              data-action="clear"
              disabled={gameStatus !== "active" || selectedNumbers.length === 0}
              onClick={clearSelection}
              type="button"
            >
              Clear <kbd>Esc</kbd>
            </button>
          </div>
        </section>
      </main>
      <footer>
        Match the stars, use each number once, and beat the clock.
      </footer>
    </div>
  );
}
