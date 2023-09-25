import { CameraProps, World } from "ray-tracer";

export type Scene = () => { cameraProps: CameraProps; world: World };
