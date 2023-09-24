export const checkAxis = (
  origin: number,
  direction: number,
  min: number,
  max: number,
): [number, number] => {
  const tminNumerator = min - origin;
  const tmaxNumerator = max - origin;
  const tmin = tminNumerator / direction;
  const tmax = tmaxNumerator / direction;

  return tmin > tmax ? [tmax, tmin] : [tmin, tmax];
};
