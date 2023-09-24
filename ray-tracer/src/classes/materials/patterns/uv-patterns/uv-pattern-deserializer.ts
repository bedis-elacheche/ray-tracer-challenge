import { SolidPattern } from "../solid-pattern";
import { UVAlignCheckPattern } from "./uv-align-check";
import { UVCheckersPattern } from "./uv-checkers";
import { UVImagePattern } from "./uv-image";
import { UVPattern, UVPatternPatternType } from "./uv-pattern";

export class UVPatternDeserializer {
  static deserialize(item: JSONObject): UVPatternPatternType {
    switch (item.__type) {
      case SolidPattern.__name__:
        return SolidPattern.deserialize(item);
      case UVImagePattern.__name__:
        return UVImagePattern.deserialize(item);
      case UVAlignCheckPattern.__name__:
        return UVAlignCheckPattern.deserialize(item);
      case UVCheckersPattern.__name__:
        return UVCheckersPattern.deserialize(item);
      default:
        return UVPattern.deserialize(item);
    }
  }
}
