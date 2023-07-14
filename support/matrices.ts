import { DataTable, Given, Then } from "@cucumber/cucumber";
import { getMatrix, getTuple } from "./utils";
import { Matrix, Tuple } from "../src";
import { expect } from "chai";

Given(
  "the following {int}x{int} matrix {word}:",
  function (r: number, c: number, varName: string, dataTable: DataTable) {
    const matrix = new Matrix(r, c);

    dataTable.raw().forEach((row, y) => {
      row.forEach((item, x) => {
        matrix.set(y, x, parseFloat(item));
      });
    });

    this[varName] = matrix;
  }
);

Given(
  "the following matrix {word}:",
  function (varName: string, dataTable: DataTable) {
    const rows = dataTable.raw();
    const matrix = new Matrix(rows.length, rows[0].length);

    rows.forEach((row, y) => {
      row.forEach((item, x) => {
        matrix.set(y, x, parseFloat(item));
      });
    });

    this[varName] = matrix;
  }
);

Given(
  "{word} ← transpose\\({word})",
  function (firstVarName: string, secondVarName: string) {
    const matrix =
      secondVarName === "identity_matrix"
        ? Matrix.identity(4)
        : getMatrix(this, secondVarName);

    this[firstVarName] = matrix;
  }
);

Given(
  "{word} ← submatrix\\({word}, {int}, {int})",
  function (firstVarName: string, secondVarName: string, r: number, c: number) {
    const matrix = getMatrix(this, secondVarName);

    this[firstVarName] = matrix.submatrix(r, c);
  }
);

Then(
  "{word} ← {word} * {word}",
  function (firstVarName: string, secondVarName: string, thirdVarName: string) {
    const second = getMatrix(this, secondVarName);
    const third = getMatrix(this, thirdVarName);

    this[firstVarName] = second.multiply(third);
  }
);

Then(
  "{word}[{int},{int}] = {float}",
  function (varName: string, y: number, x: number, value: number) {
    const matrix = getMatrix(this, varName);

    expect(matrix.get(y, x)).to.eql(value);
  }
);

Then(
  /([A-Z]+) = ([A-Z]+|identity_matrix)/,
  function (firstVarName: string, secondVarName: string) {
    const first = getMatrix(this, firstVarName);
    const second =
      secondVarName === "identity_matrix"
        ? Matrix.identity(first.rows)
        : getMatrix(this, secondVarName);

    expect(first.equals(second)).to.be.true;
  }
);

Then(
  /([A-Z]+) != ([A-Z]+)/,
  function (firstVarName: string, secondVarName: string) {
    const first = getMatrix(this, firstVarName);
    const second = getMatrix(this, secondVarName);

    expect(first.equals(second)).to.be.false;
  }
);

Then(
  "{word} * {word} is the following {int}x{int} matrix:",
  function (
    firstVarName: string,
    secondVarName: string,
    r: number,
    c: number,
    dataTable: DataTable
  ) {
    const first = getMatrix(this, firstVarName);
    const second = getMatrix(this, secondVarName);
    const expected = new Matrix(r, c);

    dataTable.raw().forEach((row, y) => {
      row.forEach((item, x) => {
        expected.set(y, x, parseFloat(item));
      });
    });

    expect(first.multiply(second).equals(expected)).to.be.true;
  }
);

Then(
  /([A-Z]+) \* ([a-z]+) = tuple\(([+-]?[0-9]*[.]?[0-9]+), ([+-]?[0-9]*[.]?[0-9]+), ([+-]?[0-9]*[.]?[0-9]+), ([+-]?[0-9]*[.]?[0-9]+)\)/,
  function (
    matrixVarName: string,
    tupleVarName: string,
    x: string,
    y: string,
    z: string,
    w: string
  ) {
    const matrix = getMatrix(this, matrixVarName);
    const tuple = getTuple(this, tupleVarName);

    expect(
      matrix
        .multiply(tuple)
        .equals(
          new Tuple(parseFloat(x), parseFloat(y), parseFloat(z), parseFloat(w))
        )
    ).to.be.true;
  }
);

Then(
  "{word} * identity_matrix = {word}",
  function (firstVarName: string, secondVarName: string) {
    const first = getMatrix(this, firstVarName);
    const second = getMatrix(this, secondVarName);

    expect(first.multiply(Matrix.identity(first.rows)).equals(second)).to.be
      .true;
  }
);

Then(
  "identity_matrix * {word} = {word}",
  function (firstVarName: string, secondVarName: string) {
    const first = getTuple(this, firstVarName);
    const second = getTuple(this, secondVarName);

    expect(Matrix.identity(4).multiply(first).equals(second)).to.be.true;
  }
);

Then(
  "transpose\\({word}) is the following matrix:",
  function (varName: string, dataTable: DataTable) {
    const matrix = getMatrix(this, varName);
    const rows = dataTable.raw();
    const expected = new Matrix(rows.length, rows[0].length);

    rows.forEach((row, y) => {
      row.forEach((item, x) => {
        expected.set(y, x, parseFloat(item));
      });
    });

    expect(matrix.transpose().equals(expected)).to.be.true;
  }
);

Then(
  "determinant\\({word}) = {float}",
  function (varName: string, value: number) {
    const matrix = getMatrix(this, varName);

    expect(matrix.determinant()).to.eql(value);
  }
);

Then(
  "submatrix\\({word}, {int}, {int}) is the following {int}x{int} matrix:",
  function (
    varName: string,
    r: number,
    c: number,
    subR: number,
    subC: number,
    dataTable: DataTable
  ) {
    const matrix = getMatrix(this, varName);
    const expected = new Matrix(subR, subC);

    dataTable.raw().forEach((row, y) => {
      row.forEach((item, x) => {
        expected.set(y, x, parseFloat(item));
      });
    });

    expect(matrix.submatrix(r, c).equals(expected)).to.be.true;
  }
);

Then(
  "minor\\({word}, {int}, {int}) = {float}",
  function (varName: string, r: number, c: number, value: number) {
    const matrix = getMatrix(this, varName);

    expect(matrix.minor(r, c)).to.eql(value);
  }
);

Then(
  "cofactor\\({word}, {int}, {int}) = {float}",
  function (varName: string, r: number, c: number, value: number) {
    const matrix = getMatrix(this, varName);

    expect(matrix.cofactor(r, c)).to.eql(value);
  }
);

Then("{word} is invertible", function (varName: string) {
  const matrix = getMatrix(this, varName);

  expect(matrix.isInvertible()).to.be.true;
});

Then("{word} is not invertible", function (varName: string) {
  const matrix = getMatrix(this, varName);

  expect(matrix.isInvertible()).to.be.false;
});

Then(
  "inverse\\({word}) is the following {int}x{int} matrix:",
  function (varName: string, r: number, c: number, dataTable: DataTable) {
    const matrix = getMatrix(this, varName);
    const expected = new Matrix(r, c);

    dataTable.raw().forEach((row, y) => {
      row.forEach((item, x) => {
        expected.set(y, x, parseFloat(item));
      });
    });

    expect(matrix.isInvertible()).to.be.true;
    expect(matrix.inverse().equals(expected)).to.be.true;
  }
);

Then(
  "{word} * inverse\\({word}) = {word}",
  function (firstVarName: string, secondVarName: string, thirdVarName: string) {
    const first = getMatrix(this, firstVarName);
    const second = getMatrix(this, secondVarName);
    const third = getMatrix(this, thirdVarName);

    expect(second.isInvertible()).to.be.true;
    expect(first.multiply(second.inverse()).equals(third)).to.be.true;
  }
);
