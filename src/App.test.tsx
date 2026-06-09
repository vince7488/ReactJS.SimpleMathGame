import { act, render, screen } from "@testing-library/react";
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

  it("renders the target and all available number buttons", () => {
    render(<App />);

    expect(screen.getByLabelText("Target: 1 stars")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Number \d: available/ }),
    ).toHaveLength(9);
    expect(screen.getByText("Time Remaining:")).toHaveTextContent(
      "Time Remaining: 10",
    );
  });

  it("marks a selected number as wrong when its sum exceeds the target", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Number 2: available" }),
    );

    expect(screen.getByRole("button", { name: "Number 2: wrong" })).toHaveStyle(
      {
        backgroundColor: "rgb(235, 20, 35)",
      },
    );
  });

  it("uses a number when it matches the target and creates a new target", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: "Number 1: available" }),
    );

    expect(screen.getByRole("button", { name: "Number 1: used" })).toHaveStyle({
      backgroundColor: "rgb(35, 255, 85)",
    });
    expect(screen.getByLabelText("Target: 2 stars")).toBeInTheDocument();
  });

  it("ends the game when the timer expires", async () => {
    vi.useFakeTimers();
    render(<App />);

    for (let second = 0; second < 10; second += 1) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText("Game Over.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Play Again?" }),
    ).toBeInTheDocument();
  });
});
