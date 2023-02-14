export type NullToUndefined<T> = T extends null
  ? undefined
  : T extends Array<infer U>
  ? Array<NullToUndefined<U>>
  : T extends Record<string, unknown>
  ? { [K in keyof T]: NullToUndefined<T[K]> }
  : T;

export function convertNullToUndefined<T>(input: T): NullToUndefined<T> {
  if (input === null || input === undefined) {
    return undefined as NullToUndefined<T>;
  }

  if (Array.isArray(input)) {
    return input.map((item) => convertNullToUndefined(item)) as NullToUndefined<T>;
  }

  if (input.constructor === Object) {
    const output: Partial<NullToUndefined<T>> = {};
    for (const key in input) {
      output[key as keyof NullToUndefined<T>] = convertNullToUndefined(
        input[key],
      ) as NullToUndefined<T>[keyof NullToUndefined<T>];
    }
    return output as NullToUndefined<T>;
  }

  return input as NullToUndefined<T>;
}
