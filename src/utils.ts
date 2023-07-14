export const clamp = (min: number, max: number, value: number) =>
  Math.max(Math.min(value, max), min);

export const splitLineIntoChunks = (words: string[], maxLength: number) => {
  const { lines, line } = words.reduce<{ lines: string[]; line: string }>(
    ({ lines, line }, word) => {
      const newLine = `${line} ${word}`.trim();

      if (newLine.length > maxLength) {
        return {
          lines: [...lines, line],
          line: word,
        };
      }

      if (newLine.length === maxLength) {
        return {
          lines: [...lines, newLine],
          line: "",
        };
      }

      return {
        lines,
        line: newLine,
      };
    },
    { lines: [], line: "" }
  );

  return line ? [...lines, line] : lines;
};
