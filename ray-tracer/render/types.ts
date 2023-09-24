import { Camera, World } from "../src";

export type Units = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Chapter = Exclude<`${0 | 1}${Units}`, "00">;
export type SceneKey = `${Chapter}-${string}`;
export type Scene = () => { camera: Camera; world: World };
