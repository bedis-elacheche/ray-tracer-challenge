import { writeFileSync } from "fs";

import { Canvas } from "../src";
import { ProgressBar } from "./progress";
import {
  clock,
  hexagon,
  projectile,
  scene,
  sceneWithAreaLight,
  sceneWithFiniteClosedCylinders,
  sceneWithFiniteCones,
  sceneWithFiniteCylinders,
  sceneWithInfiniteCylinders,
  sceneWithPatterns,
  sceneWithPlanes,
  sceneWithPyramid,
  sceneWithReflections,
  sceneWithStripes,
  shrinkedRotated3dSphere,
  shrinkedRotatedSphere,
  shrinkedSkewd3dSphere,
  shrinkedSkewdSphere,
  sphere,
  sphere3D,
  xAxisShrinked3dSphere,
  xAxisShrinkedSphere,
  yAxisShrinked3dSphere,
  yAxisShrinkedSphere,
} from "./scenes";

type Units = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Chapter = Exclude<`${0 | 1}${Units}`, "00" | "18" | "19">;
type SceneKey = `${Chapter}-${string}`;
type Scene = (sceneName: string, progress: ProgressBar) => Canvas;

const scenes: Record<SceneKey, Scene> = {
  "02-01-projectile": projectile,
  "04-01-clock": clock,
  "05-01-default-sphere": sphere,
  "05-02-x-axis-shrink-sphere": xAxisShrinkedSphere,
  "05-03-y-axis-shrink-sphere": yAxisShrinkedSphere,
  "05-04-shrinked-rotated-sphere": shrinkedRotatedSphere,
  "05-05-shrinked-skewd-sphere": shrinkedSkewdSphere,
  "06-01-default-3d-sphere": sphere3D,
  "06-02-x-axis-shrink-3d-sphere": xAxisShrinked3dSphere,
  "06-03-y-axis-shrink-3d-sphere": yAxisShrinked3dSphere,
  "06-04-shrinked-rotated-3d-sphere": shrinkedRotated3dSphere,
  "06-05-shrinked-skewd-3d-sphere": shrinkedSkewd3dSphere,
  "07-01-3d-scene": scene,
  "09-01-3d-scene-with-planes": sceneWithPlanes,
  "10-01-3d-scene-with-stripes": sceneWithStripes,
  "10-02-3d-scene-with-patterns": sceneWithPatterns,
  "11-01-3d-scene-with-reflections": sceneWithReflections,
  "13-01-3d-scene-with-infinite-cylinders": sceneWithInfiniteCylinders,
  "13-02-3d-scene-with-finite-cylinders": sceneWithFiniteCylinders,
  "13-03-3d-scene-with-finite-closed-cylinders": sceneWithFiniteClosedCylinders,
  "13-04-3d-scene-with-finite-cones": sceneWithFiniteCones,
  "14-01-3d-group-hexagon": hexagon,
  "15-01-3d-scene-with-pyramid": sceneWithPyramid,
  "16-01-3d-scene-with-area-light": sceneWithAreaLight,
};

const getLastScene = (dict: Record<SceneKey, Scene>): string =>
  Object.keys(dict).sort((a, z) => z.localeCompare(a))[0];

const sceneName = process.argv[2] ?? getLastScene(scenes) ?? "";

const renderScene = (sceneName: SceneKey, progress: ProgressBar) => {
  const existingScene = scenes[sceneName];

  if (existingScene) {
    writeFileSync(
      `./photos/${sceneName}.ppm`,
      existingScene(sceneName, progress).toPPM(),
    );
  }
};

if (sceneName === "all") {
  const bar = new ProgressBar(50, Object.keys(scenes).length);

  for (const key in scenes) {
    renderScene(key as SceneKey, bar);

    bar.increment("overall");
  }

  bar.renderSummary();
} else {
  renderScene(sceneName as SceneKey, new ProgressBar(50, 1));
}
