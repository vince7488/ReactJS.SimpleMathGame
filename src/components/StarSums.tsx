import { useGameState } from "../hooks/useGameState";
import type { ButtonStatus, GameStatus } from "../types/game";
import { range, sum } from "../utils/game";
import { NumberButton } from "./NumberButton";
import { ResetGame } from "./ResetGame";
import { Stars } from "./Stars";

interface StarSumsProps {
  startNewSession: () => void;
}

export function StarSums({ startNewSession }: StarSumsProps) {
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
      window.alert("Value is already used!");
      return;
    }

    const newSelectedNumbers =
      status === "available"
        ? [...selectedNumbers, number]
        : selectedNumbers.filter((selectedNumber) => selectedNumber !== number);

    updateGameState(newSelectedNumbers);
  };

  return (
    <>
      <header>
        <h1>Star Sum!</h1>
      </header>
      <section>
        <h2 className="help">
          Pick 1 or more numbers that sum to the number of stars (
          <a
            href="https://github.com/vince7488/ReactJS.SimpleMathGame"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub
          </a>
          )
        </h2>
        <div className="game-container">
          <div className="aspect-ratio-1-1">
            <div
              aria-label={`Target: ${starCount} stars`}
              className="stars-panel content"
            >
              {gameStatus === "active" ? (
                <Stars count={starCount} />
              ) : (
                <ResetGame gameStatus={gameStatus} onClick={startNewSession} />
              )}
            </div>
          </div>
          <div className="aspect-ratio-1-1">
            <div className="numbers-panel content">
              {range(1, 9).map((number) => (
                <NumberButton
                  key={number}
                  number={number}
                  status={currentNumberStatus(number)}
                  onClick={handleNumberClick}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="timer">
          Time Remaining:{" "}
          <span className={`${isAlmostOutOfTime ? "almost-up " : ""}the-time`}>
            {countdown}
          </span>
        </div>
      </section>
    </>
  );
}
