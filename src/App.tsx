import { useEffect, useState } from "react";

const colors = {
  available: "rgb(230,230,230)",
  used: "rgb(35,255,85)",
  wrong: "rgb(235,20,35)",
  temp: "rgb(235,195,20)",
} as const;

type ButtonStatus = keyof typeof colors;
type GameStatus = "active" | "lost" | "win";

const sum = (numbers: number[]) =>
  numbers.reduce((total, number) => total + number, 0);

const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, index) => min + index);

const random = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

const randomSumIn = (numbers: number[], max: number) => {
  const sets: number[][] = [[]];
  const sums: number[] = [];

  for (const number of numbers) {
    const existingSetCount = sets.length;

    for (let index = 0; index < existingSetCount; index += 1) {
      const candidateSet = [...sets[index], number];
      const candidateSum = sum(candidateSet);

      if (candidateSum <= max) {
        sets.push(candidateSet);
        sums.push(candidateSum);
      }
    }
  }

  return sums[random(0, sums.length - 1)];
};

function useGameState() {
  const [starCount, setStarCount] = useState(() => random(1, 9));
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState(() => range(1, 9));
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0 || availableNumbers.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [availableNumbers.length, countdown]);

  const updateGameState = (newSelectedNumbers: number[]) => {
    if (sum(newSelectedNumbers) !== starCount) {
      setSelectedNumbers(newSelectedNumbers);
      return;
    }

    const newAvailableNumbers = availableNumbers.filter(
      (number) => !newSelectedNumbers.includes(number),
    );

    setAvailableNumbers(newAvailableNumbers);
    setSelectedNumbers([]);

    if (newAvailableNumbers.length > 0) {
      setStarCount(randomSumIn(newAvailableNumbers, 9));
    }
  };

  return {
    availableNumbers,
    countdown,
    selectedNumbers,
    starCount,
    updateGameState,
  };
}

interface StarsProps {
  count: number;
}

function Stars({ count }: StarsProps) {
  return (
    <>
      {range(1, count).map((starId) => (
        <div key={starId} className="star" />
      ))}
    </>
  );
}

interface NumberButtonProps {
  number: number;
  onClick: (number: number, status: ButtonStatus) => void;
  status: ButtonStatus;
}

function NumberButton({ number, onClick, status }: NumberButtonProps) {
  return (
    <button
      className="btn-number"
      style={{
        backgroundColor: colors[status],
        color: status === "wrong" ? "rgb(255,255,255)" : "initial",
      }}
      onClick={() => onClick(number, status)}
    >
      {number}
    </button>
  );
}

interface ResetGameProps {
  gameStatus: Exclude<GameStatus, "active">;
  onClick: () => void;
}

function ResetGame({ gameStatus, onClick }: ResetGameProps) {
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

interface StarSumsProps {
  startNewSession: () => void;
}

function StarSums({ startNewSession }: StarSumsProps) {
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
    availableNumbers.length === 0
      ? "win"
      : countdown <= 0
        ? "lost"
        : "active";

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
            rel="noreferrer"
          >
            GitHub
          </a>
          )
        </h2>
        <div className="game-container">
          <div className="aspect-ratio-1-1">
            <div className="stars-panel content">
              {gameStatus === "active" ? (
                <Stars count={starCount} />
              ) : (
                <ResetGame
                  gameStatus={gameStatus}
                  onClick={startNewSession}
                />
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

export default function App() {
  const [sessionId, setSessionId] = useState(1);

  return (
    <StarSums
      key={sessionId}
      startNewSession={() => setSessionId((currentSession) => currentSession + 1)}
    />
  );
}
