import { Checkers } from "./checkers";
import { Gradient } from "./gradient";
import { Pattern } from "./pattern";
import { Ring } from "./ring";
import { Stripes } from "./stripes";

export class PatternDeserializer {
  static deserialize(item: JSONObject): Pattern {
    switch (item.__type) {
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
