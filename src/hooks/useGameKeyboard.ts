import { useEffect, useEffectEvent } from "react";
import type { GameStatus } from "../types/game";

interface UseGameKeyboardOptions {
  gameStatus: GameStatus;
  onClearSelection: () => void;
  onNumberSelect: (number: number) => void;
  onStartNewSession: () => void;
}

export function useGameKeyboard({
  gameStatus,
  onClearSelection,
  onNumberSelect,
  onStartNewSession,
}: UseGameKeyboardOptions) {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      isEditableTarget(event.target)
    ) {
      return;
    }

    if (/^[1-9]$/.test(event.key)) {
      onNumberSelect(Number(event.key));
    } else if (event.key === "Escape") {
      onClearSelection();
    } else if (event.key.toLowerCase() === "r" && gameStatus !== "active") {
      onStartNewSession();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

function isEditableTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      target.matches("input, textarea, select, [role='textbox']"))
  );
}
