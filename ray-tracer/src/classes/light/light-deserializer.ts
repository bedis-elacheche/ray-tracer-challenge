import { AreaLight } from "./area-light";
import { Light } from "./light";
import { PointLight } from "./point-light";

export class LightDeserializer {
  static deserialize(item: JSONObject): Light {
    switch (item.__type) {
      case AreaLight.__name__:
        return AreaLight.deserialize(item);
      case PointLight.__name__:
        return PointLight.deserialize(item);
      default:
        return Light.deserialize(item);
    }
  }
}
