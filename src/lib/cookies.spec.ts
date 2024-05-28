import {
  parseCookieAsArray,
  parseCookieAsObject,
  setCookieFromString,
  transformArrayToCookie,
} from './cookies'

describe('parseCookieAsArray', () => {
  it('should parse a cookie string into an array of key-value pairs', () => {
    expect(parseCookieAsArray('foo=bar; bar=baz; baz=qux')).toEqual([
      ['foo', 'bar'],
      ['bar', 'baz'],
      ['baz', 'qux'],
    ])
  })

  it('should decode URI components', () => {
    expect(parseCookieAsArray('foo=bar%20baz')).toEqual([['foo', 'bar baz']])
  })

  it('should handle equals in base64 encoded attributes', () => {
    expect(parseCookieAsArray('foo=bar=baz')).toEqual([['foo', 'bar=baz']])
  })

  it('should handle empty strings as an empty array', () => {
    expect(parseCookieAsArray('')).toEqual([])
  })

  it('should handle undefined and null values as an empty array', () => {
    expect(parseCookieAsArray(null)).toEqual([])
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(parseCookieAsArray(undefined)).toEqual([])
  })

  it('should handle missing values', () => {
    expect(parseCookieAsArray('foo=')).toEqual([['foo', '']])
  })
})

describe('transformArrayToCookie', () => {
  it('should transform an array of key-value pairs into a cookie string', () => {
    expect(
      transformArrayToCookie([
        ['foo', 'bar'],
        ['bar', 'baz'],
        ['baz', 'qux'],
      ])
    ).toBe('foo=bar; bar=baz; baz=qux')
  })

  it('should encode URI components', () => {
    expect(transformArrayToCookie([['foo', 'bar baz']])).toBe('foo=bar%20baz')
  })

  it('should handle empty arrays as an empty string', () => {
    expect(transformArrayToCookie([])).toBe('')
  })

  it('should handle missing values', () => {
    expect(transformArrayToCookie([['foo', '']])).toBe('foo=')
    expect(
      transformArrayToCookie([
        ['foo', ''],
        ['bar', 'baz'],
      ])
    ).toBe('foo=; bar=baz')
  })
})

describe('setCookieFromString', () => {
  it('should set an existing cookie from a cookie string', () => {
    expect(setCookieFromString('foo=bar; bar=baz; baz=qux', 'bar', 'hello')).toBe(
      'foo=bar; bar=hello; baz=qux'
    )
  })

  it('should handle empty strings as an empty string', () => {
    expect(setCookieFromString('foo=bar; bar=baz; baz=qux', 'bar', '')).toBe(
      'foo=bar; bar=; baz=qux'
    )
  })

  it('should do nothing when the cookie does not exist', () => {
    expect(setCookieFromString('foo=bar; bar=baz; baz=qux', 'qux', 'hello')).toBe(
      'foo=bar; bar=baz; baz=qux'
    )
  })
})

describe('parseCookieAsObject', () => {
  it('should parse a cookie string into an object', () => {
    expect(parseCookieAsObject('foo=bar; bar=baz; baz=qux')).toEqual({
      foo: 'bar',
      bar: 'baz',
      baz: 'qux',
    })
  })

  it('should decode URI components', () => {
    expect(parseCookieAsObject('foo=bar%20baz')).toEqual({ foo: 'bar baz' })
  })

  it('should handle equals in base64 encoded attributes', () => {
    expect(parseCookieAsObject('foo=bar=baz')).toEqual({ foo: 'bar=baz' })
  })

  it('should handle empty strings as an empty object', () => {
    expect(parseCookieAsObject('')).toEqual({})
  })

  it('should handle undefined and null values as an empty object', () => {
    expect(parseCookieAsObject(null)).toEqual({})
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(parseCookieAsObject(undefined)).toEqual({})
  })

  it('should handle missing values', () => {
    expect(parseCookieAsObject('foo=')).toEqual({ foo: '' })
  })
})
