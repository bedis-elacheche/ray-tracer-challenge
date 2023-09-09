import { EPSILON } from "./constants";

export const clamp = (min: number, max: number, value: number) =>
  Math.max(Math.min(value, max), min);

export const isEqual = (a: number, b: number) => {
  if (
    (a === Infinity && b === Infinity) ||
    (a === -Infinity && b === -Infinity)
  ) {
    return true;
  }

  return Math.abs(a - b) < EPSILON;
};
