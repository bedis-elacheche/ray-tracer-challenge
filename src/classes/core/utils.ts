export const clamp = (min: number, max: number, value: number) =>
  Math.max(Math.min(value, max), min);
