export const NUMBER_PAD_ORDER = [7, 8, 9, 4, 5, 6, 1, 2, 3] as const;

export const sum = (numbers: number[]) =>
  numbers.reduce((total, number) => total + number, 0);

export const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, index) => min + index);

export const random = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1));

export const randomSumIn = (numbers: number[], max: number) => {
  const sets: number[][] = [[]];
  const sums: number[] = [];

  for (const number of numbers) {
    const existingSetCount = sets.length;

    for (let index = 0; index < existingSetCount; index += 1) {
      const candidateSet = [...sets[index], number];
      const candidateSum = sum(candidateSet);

      if (candidateSum <= max) {
        sets.push(candidateSet);
        sums.push(candidateSum);
      }
    }
  }

  return sums[random(0, sums.length - 1)];
};
