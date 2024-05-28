import { parse } from 'cookie'

/**
 * Parse a cookie string into an array of key-value pairs
 *
 * @example
 * parseCookieAsArray('foo=bar; bar=baz; baz=qux')
 * //=> [['foo', 'bar'], ['bar', 'baz'], ['baz', 'qux']]
 */
export function parseCookieAsArray(cookie?: string | null): string[][] {
  if (!cookie) return []

  return cookie.split(/; */).map(c => {
    const index = c.indexOf('=') // Find the index of the first equal sign
    const key = c.slice(0, index) // Everything upto the index is the key
    const value = c.slice(index + 1) // Everything after the index is the value

    // Return the key and value
    return [decodeURIComponent(key), decodeURIComponent(value)]
  })
}

/**
 * Transform an array of key-value pairs into a cookie string
 *
 * @example
 * transformArrayToCookie([
 *  ['foo', 'bar'],
 *  ['bar', 'baz'],
 *  ['baz', 'qux'],
 * ])
 * //=> 'foo=bar; bar=baz; baz=qux'
 */
export function transformArrayToCookie(cookies: string[][]): string {
  return cookies
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('; ')
}

/**
 * Set a cookie from a cookie string. Returns the new cookie string.
 *
 * @example
 * deleteCookieFromString('foo=bar; bar=baz; baz=qux', 'bar')
 * // => 'foo=bar; bar=; baz=qux'
 */
export function setCookieFromString(cookies: string | null, name: string, value: string): string {
  const parsedCookies = parseCookieAsArray(cookies)
  const cookieIndex = parsedCookies.findIndex(([key]) => key === name)

  if (cookieIndex === -1) return cookies ?? ''

  parsedCookies.splice(cookieIndex, 1, [name, value])

  return transformArrayToCookie(parsedCookies)
}

export /**
 * Parse a cookie string into an JS object
 *
 * @example
 * parseCookieAsObject('foo=bar; bar=baz; baz=qux')
 * //=> { foo: 'bar', bar: 'baz', baz: 'qux' }
 */
function parseCookieAsObject(cookie?: string | null): Record<string, string> {
  return parse(cookie ?? '')
  // return Object.fromEntries(parseCookieAsArray(cookie)) as Record<string, string>
}
