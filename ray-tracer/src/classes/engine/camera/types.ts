import { Color } from "../../materials";
import { Canvas } from "../canvas";

type Action<
  TAction extends string,
  TPayload extends Record<string, unknown> | Record<string, unknown>[] = Record<
    string,
    never
  >,
> = {
  action: TAction;
  payload: TPayload;
};

export type Ready = Action<"ready">;

export type Online = Action<"online">;

export type InitWorker = Action<
  "init",
  { camera: JSONObject; world: JSONObject }
>;

export type CalculateColor = Action<
  "calculate-color",
  { x: number; y: number }
>;

export type ColorCalculated = Action<
  "color-calculated",
  { x: number; y: number; color: Color }
>;

export type WorkerMessage = Online | Ready | ColorCalculated;

export type MainThreadMessage = InitWorker | CalculateColor;

export type RenderOptions =
  | {
      parallel?: false;
    }
  | {
      parallel: true;
      workers: number;
    };

export type CameraEvents = {
  "pixel-rendered": [x: number, y: number, color: Color];
  "image-rendered": [canvas: Canvas];
};
