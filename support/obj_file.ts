import fs from "node:fs";
import path from "node:path";

import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "chai";

import { Group, OBJParser, Point } from "../src";
import { getGroup, getOBJParserResult, getString } from "./utils";

Given(
  "{word} ← a file containing:",
  function (varName: string, content: string) {
    this[varName] = content;
  },
);

Given(
  "{word} ← the file {string}",
  function (varName: string, fileName: string) {
    const content = fs.readFileSync(
      path.join(__dirname, "..", "files", fileName),
      "utf-8",
    );

    this[varName] = content;
  },
);

When(
  "{word} ← parse_obj_file\\({word})",
  function (parserResultVarName: string, fileVarName: string) {
    const content = getString(this, fileVarName);

    this[parserResultVarName] = OBJParser.parse(content);
  },
);

When(
  "{word} ← obj_to_group\\({word})",
  function (groupVarName: string, parserResultVarName: string) {
    const parserResult = getOBJParserResult(this, parserResultVarName);

    this[groupVarName] = parserResult.toGroup();
  },
);

When(
  "{word} ← {string} from {word}",
  function (varName: string, groupName: string, parserResultVarName: string) {
    const parserResult = getOBJParserResult(this, parserResultVarName);

    this[varName] = parserResult.groups.find(
      (group) => group.name === groupName,
    );
  },
);

Then(
  "{word} should have ignored {int} lines",
  function (parserResultVarName: string, ignoredLines: number) {
    const parserResult = getOBJParserResult(this, parserResultVarName);

    expect(parserResult.ignoredLines).to.equal(ignoredLines);
  },
);

Then(
  "{word}.vertices[{int}] = point\\({float}, {float}, {float})",
  function (
    parserResultVarName: string,
    index: number,
    x: number,
    y: number,
    z: number,
  ) {
    const parserResult = getOBJParserResult(this, parserResultVarName);

    expect(parserResult.vertices[index - 1].equals(new Point(x, y, z))).to.be
      .true;
  },
);

Then(
  "{word} includes {string} from {word}",
  function (
    groupVarName: string,
    groupName: string,
    parserResultVarName: string,
  ) {
    const parserResult = getOBJParserResult(this, parserResultVarName);
    const group = getGroup(this, groupVarName);

    const groupFromParserResult = parserResult.groups.find(
      (group) => group.name === groupName,
    );

    expect(
      group.children.find((item) => {
        if (item instanceof Group) {
          return item.equals(groupFromParserResult);
        }

        return false;
      }),
    ).to.not.be.undefined;
  },
);
