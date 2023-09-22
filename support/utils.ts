import { DataTable, IWorld } from "@cucumber/cucumber";
import { expect } from "chai";

import {
  AreaLight,
  BoundingBox,
  Camera,
  Canvas,
  Color,
  CSG,
  Cube,
  Group,
  Intersection,
  Light,
  Material,
  Matrix,
  OBJParserResult,
  Plane,
  Point,
  PointLight,
  Ray,
  Shape,
  SolidPattern,
  Sphere,
  StripesPattern,
  TextureMapPattern,
  Transformations,
  Tuple,
  UVPattern,
  Vector,
  World,
  XYZPattern,
} from "../src";

export const int = /([+-]?[0-9]+)/;
export const float = /([+-]?[0-9]*[.]?[0-9]+)/;
export const floatOrInfinity = /(([+-]?[0-9]*[.]?[0-9]+)|-?infinity)/;
export const lowercase = /([a-z_]+\d*)/;
export const uppercase = /([A-Z]+\d*)/;

// eslint-disable-next-line @typescript-eslint/ban-types
interface Type<T> extends Function {
  new (...args: unknown[]): T;
}

const getInstance =
  <TInstance>(Instance: Type<TInstance>) =>
  (world: IWorld, name: string) => {
    const item = world[name];

    expect(item).to.be.instanceOf(Instance);

    return item as TInstance;
  };

export const getTuple = getInstance(Tuple);
export const getVector = getInstance(Vector);
export const getPoint = getInstance(Point);
export const getColor = getInstance(Color);
export const getCanvas = getInstance(Canvas);
export const getMatrix = getInstance(Matrix);
export const getRay = getInstance(Ray);
export const getShape = getInstance(Shape);
export const getSphere = getInstance(Sphere);
export const getIntersection = getInstance(Intersection<Shape>);
export const getMaterial = getInstance(Material);
export const getLight = getInstance(Light);
export const getPointLight = getInstance(PointLight);
export const getAreaLight = getInstance(AreaLight);
export const getWorld = getInstance(World);
export const getCamera = getInstance(Camera);
export const getPlane = getInstance(Plane);
export const getXYZPattern = getInstance(XYZPattern);
export const getUVPattern = getInstance(UVPattern);
export const getTextureMap = getInstance(TextureMapPattern);
export const getStripe = getInstance(StripesPattern);
export const getCube = getInstance(Cube);
export const getGroup = getInstance(Group);
export const getOBJParserResult = getInstance(OBJParserResult);
export const getCSG = getInstance(CSG);
export const getBoundingBox = getInstance(BoundingBox);
export const getPatternOrTextureMap = (world: IWorld, name: string) => {
  try {
    return getXYZPattern(world, name);
  } catch (e) {
    return getTextureMap(world, name);
  }
};
export const getShapeOrGroup = (world: IWorld, name: string) => {
  try {
    return getShape(world, name);
  } catch (e) {
    return getGroup(world, name);
  }
};
export const getShapeOrGroupOrCSG = (world: IWorld, name: string) => {
  try {
    return getShape(world, name);
  } catch (e) {
    try {
      return getGroup(world, name);
    } catch (e) {
      return getCSG(world, name);
    }
  }
};

export const getNumber = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.a("number");

  return item as number;
};

export const getString = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.a("string");

  return item as string;
};

export const getBoolean = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.a("boolean");

  return item as boolean;
};

export const getArray = <TInstance>(
  world: IWorld,
  name: string,
  Instance: Type<TInstance>,
) => {
  const item = world[name];

  expect(item).to.be.an("array");

  if (item.length) {
    expect(item[0]).to.be.instanceOf(Instance);
  }

  return item as TInstance[];
};

export const mapKey = (str: string) => {
  return (
    {
      count: "length",
      color: "pattern",
      refractive_index: "refractiveIndex",
      hsize: "height",
      vsize: "width",
      pixel_size: "pixelSize",
      over_point: "overPoint",
      under_point: "underPoint",
      default_group: "defaultGroup",
      jitter_by: "jitterBy",
    }[str] || str
  );
};

export const mapValue = <T extends JSONObject>(obj: T, key: string) => {
  const dict: JSONObject = {
    identity_matrix: Matrix.identity(4),
    infinity: Infinity,
    true: true,
    false: false,
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getters: Record<string, (obj: T) => any> = {
    a: (obj: any) => obj.patterns[0].colorAt(),
    b: (obj: any) => obj.patterns[1].colorAt(),
    pattern: (obj: any) => obj.pattern.colorAt(),
    light: (obj: any) => obj.lights[0],
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return Object.hasOwn(dict, key) ? dict[key] : getters[key]?.(obj) ?? obj[key];
};

export const getNumericParameters = (str: string) => {
  return str
    .slice(str.indexOf("(") + 1, str.indexOf(")"))
    .split(", ")
    .map(parseFloat);
};

export const customizeShapeWith = <T extends Shape>(
  shape: T,
  dataTable: DataTable,
) => {
  for (const [key, value] of Object.entries(dataTable.rowsHash())) {
    switch (key) {
      case "material.color": {
        const [r, g, b] = getNumericParameters(value);
        shape.material.pattern = SolidPattern.from(r, g, b);
        break;
      }
      case "material.diffuse": {
        shape.material.diffuse = parseFloat(value);
        break;
      }
      case "material.transparency": {
        shape.material.transparency = parseFloat(value);
        break;
      }
      case "material.reflective": {
        shape.material.reflective = parseFloat(value);
        break;
      }
      case "material.refractive_index": {
        shape.material.refractiveIndex = parseFloat(value);
        break;
      }
      case "material.specular": {
        shape.material.specular = parseFloat(value);
        break;
      }
      case "material.ambient": {
        shape.material.ambient = parseFloat(value);
        break;
      }
      case "material.pattern": {
        switch (true) {
          case value === "test_pattern()": {
            shape.material.pattern = new XYZPattern();
            break;
          }
          default:
            throw `pattern ${value} setter not implemented`;
        }
        break;
      }
      case "transform": {
        switch (true) {
          case value.startsWith("scaling("): {
            const [x, y, z] = getNumericParameters(value);
            shape.transform = Transformations.scale(x, y, z);
            break;
          }
          case value.startsWith("translate("):
          case value.startsWith("translation("): {
            const [x, y, z] = getNumericParameters(value);
            shape.transform = Transformations.translation(x, y, z);
            break;
          }
          default:
            throw `transformation ${value} setter not implemented`;
        }
        break;
      }
      default:
        throw `${key} setter not implemented`;
    }
  }

  return shape;
};
