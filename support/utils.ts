import { DataTable, IWorld } from "@cucumber/cucumber";
import { expect } from "chai";

import {
  Camera,
  Canvas,
  Color,
  Cube,
  Intersection,
  Light,
  Material,
  Matrix,
  Pattern,
  Plane,
  Point,
  Ray,
  Shape,
  Sphere,
  Stripe,
  Transformations,
  Tuple,
  Vector,
  World,
} from "../src";

export const int = /([+-]?[0-9]+)/;
export const float = /([+-]?[0-9]*[.]?[0-9]+)/;
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
export const getIntersection = getInstance(Intersection);
export const getMaterial = getInstance(Material);
export const getLight = getInstance(Light);
export const getWorld = getInstance(World);
export const getCamera = getInstance(Camera);
export const getPlane = getInstance(Plane);
export const getPattern = getInstance(Pattern);
export const getStripe = getInstance(Stripe);
export const getCube = getInstance(Cube);

export const getString = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.a.string;

  return item as string;
};

export const getBoolean = (world: IWorld, name: string) => {
  const item = world[name];

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
      refractive_index: "refractiveIndex",
      pixel_size: "pixelSize",
      over_point: "overPoint",
      under_point: "underPoint",
    }[str] || str
  );
};

export const mapValue = (world: IWorld, key: string) => {
  const dict: Record<string, unknown> = {
    identity_matrix: Matrix.identity(4),
    true: true,
    false: false,
  };

  return Object.hasOwn(dict, key) ? dict[key] : world[key];
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
        shape.material.color = new Color(r, g, b);
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
            shape.material.pattern = new Pattern();
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
