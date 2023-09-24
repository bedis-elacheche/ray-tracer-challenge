export const initFormEvents = () => {
  const form = document.getElementById("form") as HTMLFormElement;
  const sceneSelector = document.getElementById("scene") as HTMLSelectElement;
  const sceneContent = document.getElementById(
    "scene-yml",
  ) as HTMLTextAreaElement;

  sceneSelector.onchange = () => {
    const value = sceneSelector.value;

    if (value) {
      sceneContent.value = Date.now().toString();
    }
  };

  form.onsubmit = (event: SubmitEvent) => {
    event.preventDefault();
  };
};
