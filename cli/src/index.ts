import { writeFileSync } from "node:fs";
import { cpus } from "node:os";

import {
  hexagon,
  Scene,
  scene,
  sceneWithAreaLight,
  sceneWithBlendedPattern,
  sceneWithBoundingBox,
  sceneWithCheckeredCube,
  sceneWithCheckeredCylinder,
  sceneWithCheckeredPlane,
  sceneWithCheckeredSphere,
  sceneWithComposedPattern,
  sceneWithFiniteClosedCylinders,
  sceneWithFiniteCones,
  sceneWithFiniteCylinders,
  sceneWithInfiniteCylinders,
  sceneWithPatterns,
  sceneWithPerturbedPattern,
  sceneWithPlanes,
  sceneWithPyramid,
  sceneWithReflections,
  sceneWithStripes,
} from "scenes";
import { sceneWithMappedEarth } from "scenes/src/earth";
import { sceneWithSkybox } from "scenes/src/scene-with-skybox";

import { Camera } from "./camera";
import { ProgressBar } from "./progress";
import { SceneKey } from "./types";

const scenes: Record<SceneKey, Scene> = {
  "07-01-3d-scene": scene,
  "09-01-3d-scene-with-planes": sceneWithPlanes,
  "10-01-3d-scene-with-stripes": sceneWithStripes,
  "10-02-3d-scene-with-patterns": sceneWithPatterns,
  "10-03-scene-with-composed-pattern": sceneWithComposedPattern,
  "10-04-scene-with-blended-pattern": sceneWithBlendedPattern,
  "10-05-scene-with-perturbed-patterns": sceneWithPerturbedPattern,
  "11-01-3d-scene-with-reflections": sceneWithReflections,
  "13-01-3d-scene-with-infinite-cylinders": sceneWithInfiniteCylinders,
  "13-02-3d-scene-with-finite-cylinders": sceneWithFiniteCylinders,
  "13-03-3d-scene-with-finite-closed-cylinders": sceneWithFiniteClosedCylinders,
  "13-04-3d-scene-with-finite-cones": sceneWithFiniteCones,
  "14-01-3d-group-hexagon": hexagon,
  "15-01-3d-scene-with-pyramid": sceneWithPyramid,
  "16-01-3d-scene-with-area-light": sceneWithAreaLight,
  "17-01-3d-scene-with-bounding-box": sceneWithBoundingBox,
  "18-01-scene-with-checkered-sphere": sceneWithCheckeredSphere,
  "18-02-scene-with-checkered-plane": sceneWithCheckeredPlane,
  "18-03-scene-with-checkered-cylinder": sceneWithCheckeredCylinder,
  "18-04-scene-with-checkered-cube": sceneWithCheckeredCube,
  "18-05-scene-with-mapped-earth": sceneWithMappedEarth,
  "18-06-scene-with-skybox": sceneWithSkybox,
};

const getLastScene = (dict: Record<SceneKey, Scene>): string =>
  Object.keys(dict).sort((a, z) => z.localeCompare(a))[0];

const renderScene = (sceneName: SceneKey, progress: ProgressBar) =>
  new Promise<void>((resolve, reject) => {
    const existingScene = scenes[sceneName];

    if (existingScene) {
      const { cameraProps, world } = existingScene();
      const camera = new Camera(cameraProps);

      progress.start(sceneName, camera.height * camera.width);

      camera.on("pixel-rendered", () => {
        progress.increment("current");
      });

      camera.on("image-rendered", (image) => {
        writeFileSync(`./photos/${sceneName}.ppm`, image.toPPM());
        resolve();
      });

      camera.render(world, { parallel: true, workers: cpus().length - 1 });
    } else {
      reject("Unknown scene");
    }
  });

(async () => {
  const sceneName = process.argv[2] ?? getLastScene(scenes) ?? "";
  if (sceneName === "all") {
    const bar = new ProgressBar(50, Object.keys(scenes).length);

    for (const key in scenes) {
      await renderScene(key as SceneKey, bar);

      bar.increment("overall");
    }

    bar.renderSummary();
  } else {
    await renderScene(sceneName as SceneKey, new ProgressBar(50, 1));
  }
})();
