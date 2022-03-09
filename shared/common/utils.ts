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