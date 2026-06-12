import type { ButtonStatus } from "../types/game";

interface NumberButtonProps {
  disabled: boolean;
  number: number;
  onClick: (number: number, status: ButtonStatus) => void;
  status: ButtonStatus;
}

export function NumberButton({
  disabled,
  number,
  onClick,
  status,
}: NumberButtonProps) {
  return (
    <button
      aria-label={`Number ${number}: ${status}`}
      aria-keyshortcuts={String(number)}
      className="btn-number"
      data-number={number}
      data-status={status}
      disabled={disabled}
      onClick={() => onClick(number, status)}
    >
      <span>{number}</span>
      <kbd>{number}</kbd>
    </button>
  );
}
