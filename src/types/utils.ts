export type Nullable<T> = { [P in keyof T]: T[P] | null }

export type Expand<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type ExpandOne<T> = {
  [K in keyof T]: T[K] extends object ? Expand<T[K]> : T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type ExpandTwo<T> = {
  [K in keyof T]: T[K] extends object ? ExpandOne<T[K]> : T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type ExpandDeep<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandDeep<O[K]> }
    : never
  : T
