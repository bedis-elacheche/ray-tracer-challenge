import "./style.css";

import { initRenderButton, initSceneSelector } from "./init";

window.onload = () => {
  const sceneSelector = initSceneSelector();
  const sceneContent = document.getElementById(
    "scene-yml",
  ) as HTMLTextAreaElement;

  initRenderButton(sceneContent, sceneSelector);
};
