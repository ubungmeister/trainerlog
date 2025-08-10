export const clamp = (min: number, v: number, max: number) =>
  Math.max(min, Math.min(v, max));
