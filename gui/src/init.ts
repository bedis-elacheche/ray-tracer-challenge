import { parseInput } from "./parser";
import { renderScene } from "./renderer";
import { Scenes } from "./scenes";

export const initSceneSelector = () => {
  const sceneSelector = document.getElementById("scene") as HTMLSelectElement;
  sceneSelector.innerHTML = Scenes.getOptions();
  sceneSelector.onchange = () => {
    const value = sceneSelector.value;

    if (value) {
      // TODO load yml
    }
  };

  return sceneSelector;
};

export const initRenderButton = (
  sceneContent: HTMLTextAreaElement,
  sceneSelector: HTMLSelectElement,
) => {
  const button = document.getElementById("render") as HTMLButtonElement;

  button.addEventListener("click", (event: MouseEvent) => {
    event.preventDefault();

    const parsed = parseInput(sceneContent.value, sceneSelector.value);

    if (!parsed) {
      return;
    }

    const { cameraProps, world } = parsed;

    renderScene({ ...cameraProps, width: 800, height: 800 }, world);
  });

  return button;
};
