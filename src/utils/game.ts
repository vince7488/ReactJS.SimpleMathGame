import type { ButtonStatus, GameStatus } from "../types/game";

export const NUMBER_PAD_ORDER = [7, 8, 9, 4, 5, 6, 1, 2, 3] as const;
export const INITIAL_GAME_FEEDBACK =
  "Choose one or more numbers to match the stars.";

export const sum = (numbers: number[]) =>
  numbers.reduce((total, number) => total + number, 0);

export const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, index) => min + index);

export const random = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

export const randomSumIn = (numbers: number[], max: number) => {
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

export const getGameStatus = (
  availableNumberCount: number,
  countdown: number,
): GameStatus => {
  if (availableNumberCount === 0) {
    return "win";
  }

  return countdown <= 0 ? "lost" : "active";
};

export const getNumberStatus = (
  number: number,
  availableNumbers: number[],
  selectedNumbers: number[],
  starCount: number,
): ButtonStatus => {
  if (!availableNumbers.includes(number)) {
    return "used";
  }

  if (selectedNumbers.includes(number)) {
    return sum(selectedNumbers) > starCount ? "wrong" : "temp";
  }

  return "available";
};

export const getUpdatedSelection = (
  number: number,
  status: ButtonStatus,
  selectedNumbers: number[],
) =>
  status === "available"
    ? [...selectedNumbers, number]
    : selectedNumbers.filter((selectedNumber) => selectedNumber !== number);

export const getSelectionFeedback = (
  selectedNumbers: number[],
  starCount: number,
) => {
  const selectedTotal = sum(selectedNumbers);

  if (selectedTotal === starCount) {
    return "Correct. Those numbers are now used.";
  }

  if (selectedTotal > starCount) {
    return `Too high: ${selectedTotal}. Deselect a number and try again.`;
  }

  if (selectedTotal > 0) {
    return `Selected total: ${selectedTotal}. Target: ${starCount}.`;
  }

  return "Selection cleared.";
};
