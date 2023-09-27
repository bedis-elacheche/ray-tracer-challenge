import type { Scene } from "scenes";
import {
  hexagon,
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

export class Scenes {
  static scenes() {
    return new Map<string, { label: string; scene: Scene }>([
      [
        "scene-with-composed-pattern",
        { label: "Composed patterns", scene: sceneWithComposedPattern },
      ],
      [
        "scene-with-perturbed-pattern",
        { label: "Perturbed patterns", scene: sceneWithPerturbedPattern },
      ],
      ["scene-with-pyramid", { label: "Pyramid", scene: sceneWithPyramid }],
      ["scene-with-stripes", { label: "Stripes", scene: sceneWithStripes }],
      [
        "scene-with-reflections",
        { label: "Reflections", scene: sceneWithReflections },
      ],
      ["scene-with-planes", { label: "Planes", scene: sceneWithPlanes }],
      ["scene-with-patterns", { label: "Patterns", scene: sceneWithPatterns }],
      [
        "scene-with-infinite-cylinders",
        { label: "Infinite cylinders", scene: sceneWithInfiniteCylinders },
      ],
      [
        "scene-with-finite-cylinders",
        { label: "Finite cylinders", scene: sceneWithFiniteCylinders },
      ],
      [
        "scene-with-closed-cylinders",
        { label: "Closed cylinders", scene: sceneWithFiniteClosedCylinders },
      ],
      [
        "scene-with-checkered-sphere",
        { label: "Checkered sphere", scene: sceneWithCheckeredSphere },
      ],
      [
        "scene-with-checkered-plane",
        { label: "Checkered plane", scene: sceneWithCheckeredPlane },
      ],
      [
        "scene-with-checkered-cylinder",
        { label: "Checkered cylinder", scene: sceneWithCheckeredCylinder },
      ],
      [
        "scene-with-checkered-cube",
        { label: "Checkered cube", scene: sceneWithCheckeredCube },
      ],
      [
        "scene-with-bounding-bog",
        { label: "Bounding box", scene: sceneWithBoundingBox },
      ],

      [
        "scene-with-area-light",
        { label: "Area light", scene: sceneWithAreaLight },
      ],
      [
        "scene-with-blended-pattern",
        { label: "Blended pattern", scene: sceneWithBlendedPattern },
      ],
      ["hexagon", { label: "Hexagon", scene: hexagon }],
      ["scene", { label: "Scene", scene: scene }],
      [
        "scene-with-finite-cones",
        { label: "Finite cones", scene: sceneWithFiniteCones },
      ],
    ]);
  }

  static getScene(sceneName: string): Scene | null {
    const scenes = Scenes.scenes();

    if (scenes.has(sceneName)) {
      return scenes.get(sceneName).scene;
    }

    return null;
  }

  static getOptions() {
    const scenes = Scenes.scenes();

    return [
      '<option value="">Select a scene</option>',
      ...Array.from(
        scenes.entries(),
        ([key, { label }]) => `<option value="${key}">${label}</option>`,
      ),
    ].join("");
  }
}
