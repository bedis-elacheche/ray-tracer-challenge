import { Pattern } from "./pattern";
import { SolidPattern } from "./solid-pattern";
import { TextureMapPattern } from "./uv-patterns";
import {
  BlendedPattern,
  CheckersPattern,
  GradientPattern,
  RingPattern,
  StripesPattern,
  XYZPattern,
} from "./xyz-patterns";

export class PatternDeserializer {
  static deserialize(item: JSONObject): Pattern {
    switch (item.__type) {
      case SolidPattern.__name__:
        return SolidPattern.deserialize(item);
      case TextureMapPattern.__name__:
        return TextureMapPattern.deserialize(item);
      case GradientPattern.__name__:
        return GradientPattern.deserialize(item);
      case CheckersPattern.__name__:
        return CheckersPattern.deserialize(item);
      case StripesPattern.__name__:
        return StripesPattern.deserialize(item);
      case RingPattern.__name__:
        return RingPattern.deserialize(item);
      case BlendedPattern.__name__:
        return BlendedPattern.deserialize(item);
      case XYZPattern.__name__:
        return XYZPattern.deserialize(item);
      default:
        throw new Error("Pattern type not recognized.");
    }
  }
}
