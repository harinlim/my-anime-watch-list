export type Nullable<T> = { [P in keyof T]: T[P] | null }

export type AllKeys<T> = T extends unknown ? keyof T : never

export type Exactify<T, K extends PropertyKey = AllKeys<T>> = T extends unknown
  ? T & Partial<Record<Exclude<K, keyof T>, never>>
  : never

/* Expand helpers for intellisense */

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

/* Test helpers for type testing */
export type Expect<T extends true> = T
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false
