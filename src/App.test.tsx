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

  it("renders the target and all available number buttons", () => {
    render(<App />);

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
    ).toBeInTheDocument();
  });

  it("marks a selected number as wrong when its sum exceeds the target", async () => {
    const user = userEvent.setup();
    render(<App />);

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

    for (let second = 0; second < 10; second += 1) {
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
    }

    expect(screen.getByText("Game Over.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Play again/ }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "r" });

    expect(
      screen.getByRole("img", { name: "Target: 1 star" }),
    ).toBeInTheDocument();
  });
});
