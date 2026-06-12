import { useState } from "react";
import {
  getGameStatus,
  getNumberStatus,
  getSelectionFeedback,
  getUpdatedSelection,
  INITIAL_GAME_FEEDBACK,
} from "../utils/game";
import { useGameKeyboard } from "./useGameKeyboard";
import { useGameState } from "./useGameState";

export function useGameController(startNewSession: () => void) {
  const [feedback, setFeedback] = useState(INITIAL_GAME_FEEDBACK);
  const {
    availableNumbers,
    countdown,
    selectedNumbers,
    starCount,
    updateGameState,
  } = useGameState();

  const gameStatus = getGameStatus(availableNumbers.length, countdown);
  const isAlmostOutOfTime =
    countdown <= 3 && countdown > 0 && availableNumbers.length > 0;

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

  useGameKeyboard({
    gameStatus,
    onClearSelection: clearSelection,
    onNumberSelect: selectNumber,
    onStartNewSession: startNewSession,
  });

  return {
    countdown,
    currentNumberStatus,
    feedback,
    gameStatus,
    isAlmostOutOfTime,
    selectedNumberCount: selectedNumbers.length,
    clearSelection,
    selectNumber,
    starCount,
  };
}
