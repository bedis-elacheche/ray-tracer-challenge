import { mod, Point, Vector } from "../../../core";

export type UVMapper = (p: Point) => [number, number];

export class UVMap {
  static spherical: UVMapper = (p) => {
    const theta = Math.atan2(p.x, p.z);
    const vec = new Vector(p.x, p.y, p.z);
    const radius = vec.magnitude();
    const phi = Math.acos(p.y / radius);
    const raw_u = theta / (2 * Math.PI);
    const u = 1 - (raw_u + 0.5);
    const v = 1 - phi / Math.PI;

    return [u, v];
  };

  static planar: UVMapper = (p) => {
    const u = mod(p.x, 1);
    const v = mod(p.z, 1);

    return [u, v];
  };

  static cylindrical: UVMapper = (p) => {
    const theta = Math.atan2(p.x, p.z);
    const raw_u = theta / (2 * Math.PI);
    const u = 1 - (raw_u + 0.5);
    const v = mod(p.y, 1);

    return [u, v];
  };
}
