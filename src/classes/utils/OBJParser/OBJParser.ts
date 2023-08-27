import { Point } from "../../core";
import { Group, Triangle } from "../../shapes";
import { OBJParserResult } from "./OBJParserResult";

export class OBJParser {
  static parse(content: string): OBJParserResult {
    const result = new OBJParserResult();

    content.split("\n").forEach((line) => {
      switch (true) {
        case line.startsWith("v "): {
          const [x, y, z] = OBJParser.getNumericParameters(line.slice(2));

          result.addVertices([new Point(x, y, z)]);

          break;
        }
        case line.startsWith("f "): {
          const items = OBJParser.getNumericParameters(line.slice(2)).map(
            (index) => result.vertices[index - 1],
          );

          result.addToGroup(OBJParser.fanTriangulation(items));

          break;
        }
        case line.startsWith("g "): {
          const groupName = line.slice(2).trim();

          result.addGroup(new Group({ name: groupName }));

          break;
        }
        default: {
          result.ignoredLines++;
        }
      }
    });

    return result;
  }

  private static getNumericParameters(str: string) {
    return str.split(" ").map((str) => parseFloat(str.trim()));
  }

  private static fanTriangulation(vertices: Point[]) {
    const triangles: Triangle[] = [];

    for (let i = 1; i < vertices.length - 1; i++) {
      const triangle = new Triangle({
        p1: vertices[0],
        p2: vertices[i],
        p3: vertices[i + 1],
      });

      triangles.push(triangle);
    }

    return triangles;
  }
}
