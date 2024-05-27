export function groupBy<T = unknown, U extends string = string>(
  arr: T[],
  getKey: (item: T) => U
): Record<U, T[]> {
  // eslint-disable-next-line unicorn/no-array-reduce
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const key = getKey(item)
    return {
      ...acc,
      [key]: [...(acc[key] ?? []), item],
    }
  }, {})
}
