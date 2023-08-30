import process from "node:process";
import rdl from "node:readline";

type Progress = {
  total: number;
  currentProgress: number;
  startedAt: number;
  scene: string;
  render?: string;
};

export class ProgressBar {
  private size: number;
  private overall: Progress;
  private current: Progress;
  private summary: Record<string, number>;

  constructor(size: number, total: number) {
    this.size = size;
    this.overall = {
      total,
      currentProgress: 0,
      startedAt: Date.now(),
      scene: "overall",
    };
    this.current = null;
    this.summary = {};
    this.clear();
  }

  private renderProgress(type: string, progress: Progress) {
    const barCompleteChar = "\u2588";
    const barIncompleteChar = "\u2591";

    let str = `${type}: `;

    for (let i = 0; i < this.size; i++) {
      const char =
        i / this.size >= progress.currentProgress / progress.total
          ? barIncompleteChar
          : barCompleteChar;

      str += char;
    }

    str += ` | Elapsed: ${Math.floor((Date.now() - progress.startedAt) / 1000)
      .toString()
      .padStart(5, " ")}s`;

    str += `| ${Math.floor((progress.currentProgress / progress.total) * 100)
      .toString()
      .padStart(3, " ")}%`;

    if (str !== progress.render) {
      progress.render = str;

      process.stdout.write(str);
    }
  }

  render() {
    rdl.cursorTo(process.stdout, 0, 0);
    this.renderProgress("Overall", this.overall);

    if (this.current) {
      rdl.cursorTo(process.stdout, 0, 1);
      this.renderProgress("Current", this.current);
      rdl.cursorTo(process.stdout, 0, 2);
      rdl.clearScreenDown(process.stdout);
      process.stdout.write(`Rendering scene: ${this.current.scene}`);
    }
  }

  private clear() {
    rdl.cursorTo(process.stdout, 0, 0);
    rdl.clearScreenDown(process.stdout);
  }

  renderSummary() {
    this.clear();

    const summary = Object.entries(this.summary)
      .sort((a, z) => z[1] - a[1])
      .reduce(
        (summary, [scene, duration]) => {
          summary.push(`${scene}: ${Math.floor(duration / 1000)}s`);

          return summary;
        },
        [
          `Total duration: ${Math.floor(
            (Date.now() - this.overall.startedAt) / 1000,
          )}s`,
        ],
      )
      .join("\n");

    process.stdout.write(summary);
  }

  isComplete(type: "overall" | "current") {
    const progress = type === "overall" ? this.overall : this.current;

    return progress.currentProgress >= progress.total;
  }

  start(scene: string, total: number) {
    if (this.isComplete("overall")) {
      return;
    }

    const startedAt = Date.now();

    if (this.current?.scene) {
      this.summary[this.current.scene] = startedAt - this.current.startedAt;
    }

    this.current = { total, currentProgress: 0, startedAt, scene };

    if (!this.overall.startedAt) {
      this.overall.startedAt = startedAt;
    }

    this.render();
  }

  increment(type: "overall" | "current", step = 1) {
    const progress = type === "overall" ? this.overall : this.current;

    if (type === "overall") {
      this.summary[this.current.scene] = Date.now() - progress.startedAt;
    }

    if (this.isComplete(type)) {
      return;
    }

    progress.currentProgress += step;

    this.render();
  }
}
