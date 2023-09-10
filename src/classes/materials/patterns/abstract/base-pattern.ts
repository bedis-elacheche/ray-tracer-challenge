import { Point, Serializable } from "../../../core";
import { BaseShape } from "../../../shapes";
import { Color } from "../../color";

export abstract class BasePattern extends Serializable {
  abstract colorAt(_p: Point, _s?: BaseShape): Color;

  equals(_p: BasePattern) {
    return false;
  }
}
