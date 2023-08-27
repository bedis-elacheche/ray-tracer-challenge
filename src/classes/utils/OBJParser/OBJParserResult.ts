import { Point } from "../../core";
import { Group, Triangle } from "../../shapes";

export class OBJParserResult {
  public ignoredLines: number;
  public vertices: Point[];
  public groups: Group[];
  public defaultGroup: Group;

  constructor() {
    this.ignoredLines = 0;
    this.vertices = [];
    this.groups = [];
    this.defaultGroup = new Group({ name: "defaultGroup" });
  }

  addVertices(vertices: Point[]) {
    this.vertices.push(...vertices);
  }

  addGroup(group: Group) {
    this.groups.push(group);
  }

  addToGroup(triangles: Triangle[]) {
    if (this.groups.length === 0) {
      this.addGroup(this.defaultGroup);
    }

    this.groups.at(-1).children.push(...triangles);
  }

  toGroup(): Group {
    return new Group({
      children: this.groups,
    });
  }
}
