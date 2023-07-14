import { IWorld } from "@cucumber/cucumber";
import { expect } from "chai";
import { Canvas, Color, Tuple, Vector, Matrix } from "../src";

export const getTuple = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.instanceOf(Tuple);

  return item as Tuple;
};

export const getVector = (world: IWorld, name: string) => {
  const item = getTuple(world, name);

  expect(item).to.be.instanceOf(Vector);

  return item as Vector;
};

export const getColor = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.instanceOf(Color);

  return item as Color;
};

export const getCanvas = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.instanceOf(Canvas);

  return item as Canvas;
};

export const getString = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.a.string;

  return item as string;
};

export const getMatrix = (world: IWorld, name: string) => {
  const item = world[name];

  expect(item).to.be.instanceOf(Matrix);

  return item as Matrix;
};