/* 
eslint-disable 
  @typescript-eslint/consistent-type-definitions, 
  @typescript-eslint/consistent-indexed-object-style,
  @typescript-eslint/ban-types,
  @typescript-eslint/no-explicit-any,
  unused-imports/no-unused-vars
*/

declare namespace Reset {
  type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T

  type WidenLiteral<T> = T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends bigint
          ? bigint
          : T extends symbol
            ? symbol
            : T
}

declare global {
  interface ReadonlyArray<T> {
    includes(searchElement: T | (Reset.WidenLiteral<T> & {}), fromIndex?: number): boolean
    lastIndexOf(searchElement: T | (Reset.WidenLiteral<T> & {}), fromIndex?: number): number
    indexOf(searchElement: T | (Reset.WidenLiteral<T> & {}), fromIndex?: number): number
    filter(predicate: BooleanConstructor, thisArg?: any): TSReset.NonFalsy<T>[]
  }

  interface Array<T> {
    includes(searchElement: T | (Reset.WidenLiteral<T> & {}), fromIndex?: number): boolean
    lastIndexOf(searchElement: T | (Reset.WidenLiteral<T> & {}), fromIndex?: number): number
    indexOf(searchElement: T | (Reset.WidenLiteral<T> & {}), fromIndex?: number): number
    filter(predicate: BooleanConstructor, thisArg?: any): TSReset.NonFalsy<T>[]
  }

  interface ArrayConstructor {
    isArray(arg: any): arg is unknown[]
  }

  interface ReadonlySet<T> {
    has(value: T | (Reset.WidenLiteral<T> & {})): boolean
  }

  interface Set<T> {
    has(value: T | (Reset.WidenLiteral<T> & {})): boolean
  }

  interface Map<K, V> {
    has(value: K | (Reset.WidenLiteral<K> & {})): boolean
  }

  interface ReadonlyMap<K, V> {
    has(value: K | (Reset.WidenLiteral<K> & {})): boolean
  }

  interface Storage {
    [name: string & {}]: unknown
  }

  interface Body {
    json(): Promise<unknown>
  }

  interface JSON {
    /**
     * Converts a JavaScript Object Notation (JSON) string into an object.
     * @param text A valid JSON string.
     * @param reviver A function that transforms the results. This function is called for each member of the object.
     * If a member contains nested objects, the nested objects are transformed before the parent object is.
     */
    parse(text: string, reviver?: (this: any, key: string, value: any) => any): unknown
  }
}

export {}
