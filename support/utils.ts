import { IWorld } from "@cucumber/cucumber";
import { expect } from "chai";
import {
  Canvas,
  Color,
  Tuple,
  Vector,
  Matrix,
  Point,
  Ray,
  Intersection,
  Sphere,
} from "../src";
import { Shape } from "../src/classes/shape";

export const int = /([+-]?[0-9]+)/;
export const float = /([+-]?[0-9]*[.]?[0-9]+)/;
export const lowercase = /([a-z]+\d*)/;
export const uppercase = /([A-Z]+\d*)/;

interface Type<T> extends Function {
  new (...args: any[]): T;
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

export const getString = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.a.string;

  return item as string;
};

export const getArray = <TInstance>(
  world: IWorld,
  name: string,
  Instance: Type<TInstance>
) => {
  const item = world[name];

  expect(item).to.be.an("array");
  expect(item[0]).to.be.instanceOf(Instance);

  return item as TInstance[];
};