export class Progress {
  total: number;
  progress: number;
  startedAt: number | undefined;
  element: {
    text: HTMLElement;
    bar: HTMLElement;
  };

  constructor() {
    const progressBarElement = document.getElementById("progress-bar");

    this.total = 0;
    this.progress = 0;
    this.element = {
      text: progressBarElement.getElementsByClassName(
        "progress-percentage",
      )[0] as HTMLElement,
      bar: progressBarElement.getElementsByClassName(
        "progress-bar-percentage",
      )[0] as HTMLElement,
    };

    this.render();
  }

  start(total: number) {
    this.total = total;
    this.progress = 0;
    this.startedAt = Date.now();

    document.body.classList.add("processing");

    this.render();
  }

  stop() {
    document.body.classList.remove("processing");
  }

  increment(step: number) {
    this.progress = Math.min(this.progress + step, this.total);

    this.render();
  }

  render() {
    const progress = `${Math.floor((this.progress / this.total) * 100)}%`;

    this.element.text.innerText = progress;
    this.element.bar.style.width = progress;
  }
}
