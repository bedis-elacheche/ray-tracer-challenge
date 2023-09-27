import { Scenes } from "./scenes";

export const parseInput = (_yml: string, key: string) => {
  // if (yml) {
  //   return; // TODO parse yml
  // }

  const scene = Scenes.getScene(key);

  if (scene) {
    return scene();
  }

  alert("Please select a scene");
};
