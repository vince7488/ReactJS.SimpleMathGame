import { afterEach, describe, expect, it, vi } from "vitest";
import { random, randomSumIn, range, sum } from "./math";

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

  it("returns an inclusive random number", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0).mockReturnValueOnce(0.999);

    expect(random(2, 5)).toBe(2);
    expect(random(2, 5)).toBe(5);
  });

  it("selects a reachable sum that does not exceed the maximum", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.999);

    expect(randomSumIn([2, 4, 8], 9)).toBe(8);
  });
});
