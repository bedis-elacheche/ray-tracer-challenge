import { IWorld } from "@cucumber/cucumber";
import { expect } from "chai";

import {
  Camera,
  Canvas,
  Color,
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
