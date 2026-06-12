import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getGameStatus,
  getDifficultyLabel,
  getNumberStatus,
  getSelectionFeedback,
  getUpdatedSelection,
  NUMBER_PAD_ORDER,
  random,
  randomSumIn,
  range,
  sum,
} from "./game";

describe("game math utilities", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sums a list of numbers", () => {
    expect(sum([])).toBe(0);
    expect(sum([1, 2, 6])).toBe(9);
  });

  it("creates an inclusive number range", () => {
    expect(range(2, 5)).toEqual([2, 3, 4, 5]);
  });

  it("orders choices like a computer number pad", () => {
    expect(NUMBER_PAD_ORDER).toEqual([7, 8, 9, 4, 5, 6, 1, 2, 3]);
  });

  it("returns an inclusive random number", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.999);

    expect(random(2, 5)).toBe(2);
    expect(random(2, 5)).toBe(5);
  });

  it("selects a reachable sum that does not exceed the maximum", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);

    expect(randomSumIn([2, 4, 8], 9)).toBe(8);
  });

  it("derives game and number statuses", () => {
    expect(getGameStatus(0, 5)).toBe("win");
    expect(getGameStatus(3, 0)).toBe("lost");
    expect(getGameStatus(3, 5)).toBe("active");

    expect(getNumberStatus(1, [2, 3], [], 3)).toBe("used");
    expect(getNumberStatus(2, [2, 3], [2], 3)).toBe("temp");
    expect(getNumberStatus(3, [2, 3], [2, 3], 3)).toBe("wrong");
    expect(getNumberStatus(3, [2, 3], [], 3)).toBe("available");
  });

  it("groups difficulty levels into readable labels", () => {
    expect(getDifficultyLabel(1)).toBe("Easy");
    expect(getDifficultyLabel(3)).toBe("Easy");
    expect(getDifficultyLabel(4)).toBe("Medium");
    expect(getDifficultyLabel(5)).toBe("Hard");
    expect(getDifficultyLabel(7)).toBe("Hard");
  });

  it("updates selections and generates feedback", () => {
    expect(getUpdatedSelection(2, "available", [1])).toEqual([1, 2]);
    expect(getUpdatedSelection(2, "temp", [1, 2])).toEqual([1]);

    expect(getSelectionFeedback([1, 2], 3)).toBe(
      "Correct. Those numbers are now used.",
    );
    expect(getSelectionFeedback([2, 3], 3)).toContain("Too high: 5");
    expect(getSelectionFeedback([1], 3)).toBe("Selected total: 1. Target: 3.");
    expect(getSelectionFeedback([], 3)).toBe("Selection cleared.");
  });
});
