import { Camera, World } from "ray-tracer";

export type Scene = () => { camera: Camera; world: World };
