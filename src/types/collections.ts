export interface IDictionary<T> {
  [key: string]: T | T[] | IDictionary<T> | IDictionary<T>[];
}
