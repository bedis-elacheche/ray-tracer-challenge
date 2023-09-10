import { UVCheckers } from "./uv-checkers";
import { UVPattern } from "./uv-pattern";

export class UVPatternDeserializer {
  static deserialize(item: JSONObject): UVPattern {
    switch (item.__type) {
      case UVCheckers.__name__:
        return UVCheckers.deserialize(item);
      default:
        return UVPattern.deserialize(item);
    }
  }
}
