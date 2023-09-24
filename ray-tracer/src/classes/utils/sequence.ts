export function* sequence(...args: number[]) {
  const n = args.length;
  let i = 0;

  if (n === 0) {
    return 0;
  }

  while (true) {
    yield args[((i++ % n) + n) % n];
  }
}
