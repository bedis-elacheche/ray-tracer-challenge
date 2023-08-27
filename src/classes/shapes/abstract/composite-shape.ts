import { Material } from "../../materials";

export abstract class CompositeShape {
  abstract applyMaterial(_material: Material): void;
}
