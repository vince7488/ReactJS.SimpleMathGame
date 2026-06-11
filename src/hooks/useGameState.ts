import { useEffect, useState } from "react";
import { random, randomSumIn, range, sum } from "../utils/game";

export function useGameState() {
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
