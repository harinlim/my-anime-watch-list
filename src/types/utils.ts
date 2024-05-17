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

// TODO: FIX THIS TO INCLUDE DEPTH FOR INFINITE RECURSION
export type ExpandDeep<T> = {
  [K in keyof T]: T[K] extends object ? ExpandDeep<T[K]> : T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}
