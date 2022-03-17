import util from 'util';

export async function waitForCondition(condition: () => boolean, delay: number = 100): Promise<void> {
  let timeout: NodeJS.Timeout = setTimeout(() => null, 0);
  while (!condition()) {
    await new Promise(resolve => {
      clearTimeout(timeout);
      timeout = setTimeout(resolve, delay);
    });
  }
  clearTimeout(timeout);
};

export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function deepToString(obj: any): string {
  return util.inspect(obj, { showHidden: false, depth: null, colors: true });
}

export function range(start: number, length: number, step: number = 1): Iterator<number> & { [Symbol.iterator] } {
  const indices: number[] = Array.from({ length }, (_, i) => i * step + start);
  let index = 0;
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      const current = { value: indices[index], done: (index >= length) };
      index++;
      return current;
    }
  }
}