import { useGameController } from "../hooks/useGameController";
import { NUMBER_PAD_ORDER } from "../utils/game";
import { NumberButton } from "./NumberButton";
import { ReadyGame } from "./ReadyGame";
import { ResetGame } from "./ResetGame";
import { Stars } from "./Stars";

interface StarSumsProps {
  startNewSession: () => void;
}

export function StarSums({ startNewSession }: StarSumsProps) {
  const {
    clearSelection,
    countdown,
    currentNumberStatus,
    feedback,
    gameStatus,
    isAlmostOutOfTime,
    selectedNumberCount,
    selectNumber,
    startGame,
    starCount,
  } = useGameController(startNewSession);

  return (
    <div className="app-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">
            Quick sums · nine numbers · by{" "}
            <a href="https://vernard.net" target="_blank" rel="noopener">
              Vernard Mercader
            </a>{" "}
            · Have fun!
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
      <main className="game-board" data-game-status={gameStatus}>
        <section
          className="game-panel target-panel"
          aria-labelledby="target-title"
        >
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">Your target</p>
              <h2 aria-live="polite" id="target-title">
                {gameStatus === "ready"
                  ? "Waiting to begin"
                  : gameStatus === "active"
                    ? `${starCount} ${starCount === 1 ? "star" : "stars"}`
                    : "Round complete"}
              </h2>
            </div>
            <div
              aria-label={`${countdown} seconds remaining`}
              className={`timer ${gameStatus === "ready" ? "is-paused" : ""} ${isAlmostOutOfTime ? "almost-up" : ""}`}
              role="timer"
            >
              <span className="timer-label">Time Remaining:</span>
              <strong>{countdown}</strong>
              <small>sec</small>
            </div>
          </div>
          <div className="stars-stage">
            {gameStatus === "ready" ? (
              <ReadyGame onClick={startGame} />
            ) : gameStatus === "active" ? (
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
              Tap or press <kbd>1</kbd>&ndash;<kbd>9</kbd>
            </p>
          </div>
          <div className="number-grid">
            {NUMBER_PAD_ORDER.map((number) => (
              <NumberButton
                key={number}
                disabled={gameStatus !== "active"}
                number={number}
                status={currentNumberStatus(number)}
                onClick={selectNumber}
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
              disabled={gameStatus !== "active" || selectedNumberCount === 0}
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
