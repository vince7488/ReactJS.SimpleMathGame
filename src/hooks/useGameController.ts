import { useState } from "react";
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTY_SECONDS,
  getGameStatus,
  getNumberStatus,
  getSelectionFeedback,
  getUpdatedSelection,
  INITIAL_GAME_FEEDBACK,
} from "../utils/game";
import type { DifficultyLevel } from "../types/game";
import { useGameKeyboard } from "./useGameKeyboard";
import { useGameState } from "./useGameState";

export function useGameController(startNewSession: () => void) {
  const [feedback, setFeedback] = useState(INITIAL_GAME_FEEDBACK);
  const [difficulty, setDifficulty] = useState(DEFAULT_DIFFICULTY);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const {
    availableNumbers,
    countdown,
    selectedNumbers,
    setReadyCountdown,
    starCount,
    updateGameState,
  } = useGameState(isGameStarted, DIFFICULTY_SECONDS[difficulty]);

  const gameStatus = isGameStarted
    ? getGameStatus(availableNumbers.length, countdown)
    : "ready";
  const isAlmostOutOfTime =
    gameStatus === "active" &&
    countdown <= 3 &&
    countdown > 0 &&
    availableNumbers.length > 0;

  const currentNumberStatus = (number: number) =>
    getNumberStatus(number, availableNumbers, selectedNumbers, starCount);

  const selectNumber = (number: number) => {
    if (gameStatus !== "active") {
      return;
    }

    const status = currentNumberStatus(number);

    if (status === "used") {
      setFeedback(`Number ${number} has already been used.`);
      return;
    }

    const newSelectedNumbers = getUpdatedSelection(
      number,
      status,
      selectedNumbers,
    );

    setFeedback(getSelectionFeedback(newSelectedNumbers, starCount));
    updateGameState(newSelectedNumbers);
  };

  const clearSelection = () => {
    if (gameStatus !== "active" || selectedNumbers.length === 0) {
      return;
    }

    updateGameState([]);
    setFeedback("Selection cleared.");
  };

  const startGame = () => {
    if (gameStatus === "ready") {
      setIsGameStarted(true);
    }
  };

  const changeDifficulty = (level: DifficultyLevel) => {
    if (gameStatus === "ready") {
      setDifficulty(level);
      setReadyCountdown(DIFFICULTY_SECONDS[level]);
    }
  };

  useGameKeyboard({
    gameStatus,
    onClearSelection: clearSelection,
    onNumberSelect: selectNumber,
    onStartGame: startGame,
    onStartNewSession: startNewSession,
  });

  return {
    countdown,
    currentNumberStatus,
    difficulty,
    feedback,
    gameStatus,
    isAlmostOutOfTime,
    selectedNumberCount: selectedNumbers.length,
    clearSelection,
    changeDifficulty,
    selectNumber,
    startGame,
    starCount,
  };
}
