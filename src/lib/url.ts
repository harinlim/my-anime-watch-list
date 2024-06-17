import { headers as nextHeaders } from 'next/headers'

export function withBaseURL(route: string, headers?: Headers) {
  const host = (headers ?? nextHeaders()).get('host')
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https'
  return `${protocol}://${host}${route}`
}

export function isSameOrigin(url: string, headers?: Headers) {
  const host = (headers ?? nextHeaders()).get('host')
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https'
  return url.startsWith(`${protocol}://${host}`)
}

export function isSamePath(url: string, path: string) {
  const urlPath = new URL(url).pathname
  return urlPath === path
}
