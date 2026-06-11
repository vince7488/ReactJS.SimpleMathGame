import { range } from "../utils/game";

interface StarsProps {
  count: number;
}

export function Stars({ count }: StarsProps) {
  return (
    <>
      {range(1, count).map((starId) => (
        <div key={starId} className="star" />
      ))}
    </>
  );
}
