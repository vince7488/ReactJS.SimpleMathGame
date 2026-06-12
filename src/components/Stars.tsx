import { range } from "../utils/game";

interface StarsProps {
  count: number;
}

export function Stars({ count }: StarsProps) {
  const starLabel = `${count} ${count === 1 ? "star" : "stars"}`;

  return (
    <div
      aria-label={`Target: ${starLabel}`}
      className="stars-display"
      role="img"
    >
      {range(1, count).map((starId) => (
        <span key={starId} aria-hidden="true" className="star">
          ★
        </span>
      ))}
    </div>
  );
}
