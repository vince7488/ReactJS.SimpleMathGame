import { afterEach, describe, expect, it, vi } from "vitest";
import { NUMBER_PAD_ORDER, random, randomSumIn, range, sum } from "./game";

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
});
