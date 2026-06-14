import { type KeyboardEvent, type RefObject, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface HelpModalProps {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}

export function HelpModal({ onClose, returnFocusRef }: HelpModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const returnFocusElement = returnFocusRef.current;

    closeButtonRef.current?.focus();

    return () => {
      returnFocusElement?.focus();
    };
  }, [returnFocusRef]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      closeButtonRef.current?.focus();
    }
  };

  return createPortal(
    <div
      className="help-backdrop"
      onKeyDown={handleKeyDown}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        aria-describedby="help-introduction"
        aria-labelledby="help-title"
        aria-modal="true"
        className="help-modal"
        role="dialog"
      >
        <div className="help-modal-header">
          <div>
            <p className="panel-kicker">Game guide</p>
            <h2 id="help-title">How to play Star Sum</h2>
          </div>
          <button
            aria-label="Close help"
            className="help-close-button"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="help-modal-content">
          <p id="help-introduction">
            Match the stars by choosing number tiles whose total equals the
            current target. Use every number before time runs out to win.
          </p>

          <section>
            <h3>Start a round</h3>
            <ol>
              <li>
                Choose a difficulty. Easier levels give you more time, while
                harder levels move quickly.
              </li>
              <li>
                Select <strong>Start game</strong> or press <kbd>Enter</kbd> to
                begin the countdown.
              </li>
              <li>
                Choose one or more number tiles that add up to the displayed
                number of stars.
              </li>
            </ol>
          </section>

          <section>
            <h3>Rules</h3>
            <ul>
              <li>A correct combination marks those numbers as used.</li>
              <li>Each number can be used only once during a round.</li>
              <li>
                Select a chosen number again to remove it from your current
                total.
              </li>
              <li>
                Use all nine numbers before the clock reaches zero to win.
              </li>
            </ul>
          </section>

          <section>
            <h3>Controls</h3>
            <ul>
              <li>
                Tap a number tile or press <kbd>1</kbd>&ndash;<kbd>9</kbd>.
              </li>
              <li>
                Select <strong>Clear</strong> or press <kbd>Esc</kbd> to clear
                your current selection.
              </li>
              <li>
                After a round ends, select <strong>Play again</strong> or press{' '}
                <kbd>R</kbd>.
              </li>
            </ul>
          </section>
        </div>
      </section>
    </div>,
    document.body,
  );
}
