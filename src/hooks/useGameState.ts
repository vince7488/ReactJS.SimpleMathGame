import { useEffect, useState } from "react";
import { random, randomSumIn, range, sum } from "../utils/game";

export function useGameState(isRunning: boolean, startingCountdown: number) {
  const [starCount, setStarCount] = useState(() => random(1, 9));
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState(() => range(1, 9));
  const [countdown, setCountdown] = useState(startingCountdown);

  const setReadyCountdown = (newCountdown: number) => {
    if (!isRunning) {
      setCountdown(newCountdown);
    }
  };

  useEffect(() => {
    if (!isRunning || countdown <= 0 || availableNumbers.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((currentCountdown) => currentCountdown - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [availableNumbers.length, countdown, isRunning]);

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
    setReadyCountdown,
    starCount,
    updateGameState,
  };
}
