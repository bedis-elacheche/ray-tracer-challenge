import {
  Cone,
  CSG,
  Cube,
  Cylinder,
  Group,
  Plane,
  Shape,
  SmoothTriangle,
  Sphere,
  Triangle,
} from ".";

export class ShapeDeserializer {
  static deserialize(item: JSONObject): Shape | CSG | Group {
    switch (item.__type) {
      case SmoothTriangle.__name__:
        return SmoothTriangle.deserialize(item);
      case Triangle.__name__:
        return Triangle.deserialize(item);
      case Plane.__name__:
        return Plane.deserialize(item);
      case Cube.__name__:
        return Cube.deserialize(item);
      case Sphere.__name__:
        return Sphere.deserialize(item);
      case Cone.__name__:
        return Cone.deserialize(item);
      case Cylinder.__name__:
        return Cylinder.deserialize(item);
      case CSG.__name__:
        return CSG.deserialize(item);
      case Group.__name__:
        return Group.deserialize(item);
      default:
        return Shape.deserialize(item);
    }
  }
}
