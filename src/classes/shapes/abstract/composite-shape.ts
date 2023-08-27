import { Material } from "../../materials";
import { BaseShape } from "./base-shape";

export abstract class CompositeShape {
  abstract applyMaterial(_material: Material): void;
  abstract includes(s: BaseShape): boolean;
}
