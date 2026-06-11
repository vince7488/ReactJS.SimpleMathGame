import type { ButtonStatus } from "../types/game";

const buttonColors: Record<ButtonStatus, string> = {
  available: "rgb(230,230,230)",
  used: "rgb(35,255,85)",
  wrong: "rgb(235,20,35)",
  temp: "rgb(235,195,20)",
};

interface NumberButtonProps {
  number: number;
  onClick: (number: number, status: ButtonStatus) => void;
  status: ButtonStatus;
}

export function NumberButton({ number, onClick, status }: NumberButtonProps) {
  return (
    <button
      aria-label={`Number ${number}: ${status}`}
      className="btn-number"
      style={{
        backgroundColor: buttonColors[status],
        color: status === "wrong" ? "rgb(255,255,255)" : "initial",
      }}
      onClick={() => onClick(number, status)}
    >
      {number}
    </button>
  );
}
