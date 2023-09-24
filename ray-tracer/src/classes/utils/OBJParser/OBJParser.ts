import { Point, Vector } from "../../core";
import { Group, SmoothTriangle, Triangle, TriangleProps } from "../../shapes";
import { OBJParserResult } from "./OBJParserResult";

export class OBJParser {
  static parse(content: string): OBJParserResult {
    const result = new OBJParserResult();

    content.split("\n").forEach((line) => {
      switch (true) {
        case line.startsWith("v "): {
          const [x, y, z] = OBJParser.parseCoordinates(line.slice(2));

          result.addVertices([new Point(x, y, z)]);

          break;
        }
        case line.startsWith("vn "): {
          const [x, y, z] = OBJParser.parseCoordinates(line.slice(3));

          result.addNormals([new Vector(x, y, z)]);

          break;
        }
        case line.startsWith("f "): {
          const items = OBJParser.parseFace(line.slice(2)).map(
            ({ vertexIndex, normalIndex }) => ({
              vertex: result.vertices[vertexIndex - 1],
              normal: result.normals[normalIndex - 1],
            }),
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

  private static parseCoordinates(str: string) {
    return str.split(" ").map((str) => parseFloat(str.trim()));
  }

  private static parseFace(str: string) {
    return str.split(" ").map((str) => {
      const [vertexIndex, textureVertex, normalIndex] = str
        .trim()
        .split("/")
        .map(parseFloat);

      return {
        vertexIndex,
        textureVertex,
        normalIndex,
      };
    });
  }

  private static fanTriangulation(data: { vertex: Point; normal?: Vector }[]) {
    const triangles: Triangle[] = [];

    for (let i = 1; i < data.length - 1; i++) {
      const triangleProps: TriangleProps = {
        p1: data[0].vertex,
        p2: data[i].vertex,
        p3: data[i + 1].vertex,
      };

      const triangle = data[0].normal
        ? new SmoothTriangle({
            ...triangleProps,
            n1: data[0].normal,
            n2: data[i].normal,
            n3: data[i + 1].normal,
          })
        : new Triangle(triangleProps);

      triangles.push(triangle);
    }

    return triangles;
  }
}
