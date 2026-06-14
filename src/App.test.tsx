import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("core gameplay", () => {
  beforeEach(() => {
    vi.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("waits for the user before starting the game", async () => {
    vi.useFakeTimers();
    render(<App />);

    expect(screen.getByText("Ready to Start?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start game/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Difficulty" })).toHaveValue("4");
    expect(screen.getByRole("slider", { name: "Difficulty" })).toHaveAttribute(
      "aria-valuetext",
      "Level 4, 10 seconds",
    );
    expect(screen.getByText("Medium 4")).toHaveClass("difficulty-badge");
    expect(Math.random).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "r" });

    expect(Math.random).toHaveBeenCalledTimes(1);
    expect(
      screen.getAllByRole("button", { name: /Number \d: available/ }),
    ).toHaveLength(9);
    for (const numberButton of screen.getAllByRole("button", {
      name: /Number \d: available/,
    })) {
      expect(numberButton).toBeDisabled();
    }

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.getByRole("timer", { name: "10 seconds remaining" }),
    ).toHaveClass("is-paused");
  });

  it("snaps difficulty levels to their configured countdowns", () => {
    render(<App />);

    const difficulty = screen.getByRole("slider", { name: "Difficulty" });
    const countdowns = [20, 15, 12, 10, 8, 5, 3];

    expect(difficulty).toHaveAttribute("min", "1");
    expect(difficulty).toHaveAttribute("max", "7");
    expect(difficulty).toHaveAttribute("step", "1");

    for (const [index, countdown] of countdowns.entries()) {
      const level = index + 1;

      fireEvent.change(difficulty, { target: { value: String(level) } });

      expect(difficulty).toHaveValue(String(level));
      expect(difficulty).toHaveAttribute(
        "aria-valuetext",
        `Level ${level}, ${countdown} seconds`,
      );
      expect(
        screen.getByText(
          `${level <= 3 ? "Easy" : level === 4 ? "Medium" : "Hard"} ${level}`,
        ),
      ).toHaveClass("difficulty-badge");
      expect(
        screen.getByRole("timer", {
          name: `${countdown} seconds remaining`,
        }),
      ).toHaveClass("is-paused");
      expect(
        screen.getByRole("timer", {
          name: `${countdown} seconds remaining`,
        }),
      ).not.toHaveClass("almost-up");
    }
  });

  it("starts the game with Enter and renders the target", async () => {
    render(<App />);

    fireEvent.keyDown(window, { key: "Enter" });

    expect(
      screen.getByRole("img", { name: "Target: 1 star" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Number \d: available/ }),
    ).toHaveLength(9);
    expect(
      screen
        .getAllByRole("button", { name: /Number \d: available/ })
        .map((button) => button.getAttribute("data-number")),
    ).toEqual(["7", "8", "9", "4", "5", "6", "1", "2", "3"]);
    expect(
      screen.getByRole("timer", { name: "10 seconds remaining" }),
    ).not.toHaveClass("is-paused");
  });

  it("opens help in an accessible modal without triggering gameplay behind it", async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.keyDown(window, { key: "Enter" });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const helpButton = screen.getByRole("button", { name: "Help" });
    fireEvent.click(helpButton);

    expect(
      screen.getByRole("dialog", { name: "How to play Star Sum" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close help" }),
    ).toHaveFocus();
    expect(
      screen.getByText(/Use all nine numbers before/),
    ).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("button", { name: "Close help" }), {
      key: "2",
    });

    expect(
      screen.getByRole("button", { name: "Number 2: available" }),
    ).toHaveAttribute("data-status", "available");

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.getByRole("timer", { name: "9 seconds remaining" }),
    ).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("button", { name: "Close help" }), {
      key: "Escape",
    });

    expect(
      screen.queryByRole("dialog", { name: "How to play Star Sum" }),
    ).not.toBeInTheDocument();
    expect(helpButton).toHaveFocus();
  });

  it("opens help with the keyboard without starting the round", async () => {
    const user = userEvent.setup();
    render(<App />);

    const helpButton = screen.getByRole("button", { name: "Help" });
    helpButton.focus();
    await user.keyboard("{Enter}");

    expect(
      screen.getByRole("dialog", { name: "How to play Star Sum" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Ready to Start?")).toBeInTheDocument();
    expect(
      screen.getByRole("timer", { name: "10 seconds remaining" }),
    ).toHaveClass("is-paused");
  });

  it("marks a selected number as wrong when its sum exceeds the target", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Start game/ }));
    await user.click(
      screen.getByRole("button", { name: "Number 2: available" }),
    );

    expect(
      screen.getByRole("button", { name: "Number 2: wrong" }),
    ).toHaveAttribute("data-status", "wrong");
    expect(screen.getByRole("status")).toHaveTextContent("Too high: 2");
  });

  it("uses a number when it matches the target and creates a new target", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /Start game/ }));
    await user.click(
      screen.getByRole("button", { name: "Number 1: available" }),
    );

    expect(
      screen.getByRole("button", { name: "Number 1: used" }),
    ).toHaveAttribute("data-status", "used");
    expect(
      screen.getByRole("img", { name: "Target: 2 stars" }),
    ).toBeInTheDocument();
  });

  it("supports number keys and Escape without a blocking alert", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard("2");

    expect(
      screen.getByRole("button", { name: "Number 2: available" }),
    ).toBeDisabled();

    await user.keyboard("{Enter}");
    await user.keyboard("2");

    expect(
      screen.getByRole("button", { name: "Number 2: wrong" }),
    ).toHaveAttribute("data-status", "wrong");

    await user.keyboard("{Escape}");

    expect(
      screen.getByRole("button", { name: "Number 2: available" }),
    ).toHaveAttribute("data-status", "available");
    expect(screen.getByRole("status")).toHaveTextContent("Selection cleared.");

    await user.keyboard("1");
    await user.keyboard("1");

    expect(screen.getByRole("status")).toHaveTextContent(
      "Number 1 has already been used.",
    );
  });

  it("ends the game when the timer expires", async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.change(screen.getByRole("slider", { name: "Difficulty" }), {
      target: { value: "7" },
    });
    fireEvent.keyDown(window, { key: "Enter" });

    expect(
      screen.queryByRole("slider", { name: "Difficulty" }),
    ).not.toBeInTheDocument();

    for (let second = 0; second < 3; second += 1) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText("Game Over.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Play again/ }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "r" });

    expect(screen.getByText("Ready to Start?")).toBeInTheDocument();
    expect(
      screen.getByRole("timer", { name: "10 seconds remaining" }),
    ).toHaveClass("is-paused");
    expect(screen.getByRole("slider", { name: "Difficulty" })).toHaveValue("4");
  });
});
