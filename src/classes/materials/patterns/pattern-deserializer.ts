import { BasePattern } from "./abstract";
import { Checkers, Gradient, Pattern, Ring, Stripes } from "./patterns";
import { TextureMap } from "./uv-patterns";

export class PatternDeserializer {
  static deserialize(item: JSONObject): BasePattern {
    switch (item.__type) {
      case TextureMap.__name__:
        return TextureMap.deserialize(item);
      case Gradient.__name__:
        return Gradient.deserialize(item);
      case Checkers.__name__:
        return Checkers.deserialize(item);
      case Stripes.__name__:
        return Stripes.deserialize(item);
      case Ring.__name__:
        return Ring.deserialize(item);
      default:
        return Pattern.deserialize(item);
    }
  }
}
