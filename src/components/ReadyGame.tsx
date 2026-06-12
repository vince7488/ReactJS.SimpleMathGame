interface ReadyGameProps {
  onClick: () => void;
}

export function ReadyGame({ onClick }: ReadyGameProps) {
  return (
    <div className="game-end-container">
      <span className="game-end-stat isready">Ready to Start?</span>
      <p>The clock starts when you do.</p>
      <button aria-keyshortcuts="Enter" type="button" onClick={onClick}>
        Start game <kbd>Enter</kbd>
      </button>
    </div>
  );
}
