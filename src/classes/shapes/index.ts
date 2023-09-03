import { CSG } from "./csg";
import { Group } from "./group";
import { Shape } from "./shape";

export * from "./abstract";
export * from "./cone";
export * from "./csg";
export * from "./cube";
export * from "./cylinder";
export * from "./group";
export * from "./plane";
export * from "./shape";
export * from "./shape-deserializer";
export * from "./smooth-triangle";
export * from "./sphere";
export * from "./triangle";

export type ShapeType = Shape | Group | CSG;
