import { EPSILON } from "./constants";

export const clamp = (min: number, max: number, value: number) =>
  Math.max(Math.min(value, max), min);

export const lerp = (a: number, b: number, x: number) => a + x * (b - a);

export const isEqual = (a: number, b: number) => {
  if (
    (a === Infinity && b === Infinity) ||
    (a === -Infinity && b === -Infinity)
  ) {
    return true;
  }

  return Math.abs(a - b) < EPSILON;
};

export const mod = (a: number, n: number) => ((a % n) + n) % n;
