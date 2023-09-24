import { mod, Point, Vector } from ".";

export type UVMapper = (p: Point) => [[number, number], string | undefined];

export const spherical: UVMapper = (p) => {
  const theta = Math.atan2(p.x, p.z);
  const vec = new Vector(p.x, p.y, p.z);
  const radius = vec.magnitude();
  const phi = Math.acos(p.y / radius);
  const raw_u = theta / (2 * Math.PI);
  const u = 1 - (raw_u + 0.5);
  const v = 1 - phi / Math.PI;

  return [[u, v], "main"];
};

export const planar: UVMapper = (p) => {
  const u = mod(p.x, 1);
  const v = mod(p.z, 1);

  return [[u, v], "main"];
};

export const cylindrical: UVMapper = (p) => {
  const theta = Math.atan2(p.x, p.z);
  const raw_u = theta / (2 * Math.PI);
  const u = 1 - (raw_u + 0.5);
  const v = mod(p.y, 1);

  return [[u, v], "main"];
};

export const cubicFrontFace: UVMapper = (p) => {
  const u = mod(p.x + 1, 2) / 2;
  const v = mod(p.y + 1, 2) / 2;

  return [[u, v], Face.FRONT];
};

export const cubicBackFace: UVMapper = (p) => {
  const u = mod(1 - p.x, 2) / 2;
  const v = mod(p.y + 1, 2) / 2;

  return [[u, v], Face.BACK];
};

export const cubicLeftFace: UVMapper = (p) => {
  const u = mod(p.z + 1, 2) / 2;
  const v = mod(p.y + 1, 2) / 2;

  return [[u, v], Face.LEFT];
};

export const cubicRightFace: UVMapper = (p) => {
  const u = mod(1 - p.z, 2) / 2;
  const v = mod(p.y + 1, 2) / 2;

  return [[u, v], Face.RIGHT];
};

export const cubicUpFace: UVMapper = (p) => {
  const u = mod(p.x + 1, 2) / 2;
  const v = mod(1 - p.z, 2) / 2;

  return [[u, v], Face.UP];
};

export const cubicDownFace: UVMapper = (p) => {
  const u = mod(p.x + 1, 2) / 2;
  const v = mod(p.z + 1, 2) / 2;

  return [[u, v], Face.DOWN];
};

export const Face = {
  RIGHT: "right",
  LEFT: "left",
  UP: "up",
  DOWN: "down",
  FRONT: "front",
  BACK: "back",
} as const;

export type Face = (typeof Face)[keyof typeof Face];

export const cubicFaceFromPoint = (point: Point): Face => {
  const absX = Math.abs(point.x);
  const absY = Math.abs(point.y);
  const absZ = Math.abs(point.z);
  const coord = Math.max(absX, absY, absZ);

  if (coord === point.x) {
    return Face.RIGHT;
  }
  if (coord === -point.x) {
    return Face.LEFT;
  }
  if (coord === point.y) {
    return Face.UP;
  }
  if (coord === -point.y) {
    return Face.DOWN;
  }
  if (coord === point.z) {
    return Face.FRONT;
  }

  return Face.BACK;
};

export const cubic = (p: Point) => {
  const face = cubicFaceFromPoint(p);

  switch (face) {
    case Face.LEFT:
      return cubicLeftFace(p);
    case Face.RIGHT:
      return cubicRightFace(p);
    case Face.FRONT:
      return cubicFrontFace(p);
    case Face.BACK:
      return cubicBackFace(p);
    case Face.UP:
      return cubicUpFace(p);
    default:
      return cubicDownFace(p);
  }
};

export type UVMapType = "spherical" | "planar" | "cylindrical" | "cubic";

export class UVMap {
  static map(p: Point, map: UVMapType) {
    switch (map) {
      case "spherical":
        return spherical(p);
      case "planar":
        return planar(p);
      case "cylindrical":
        return cylindrical(p);
      case "cubic":
        return cubic(p);
    }
  }
}
