import { headers } from 'next/headers'

const X_PROXY_HEADER_KEY = process.env.PROXY_HEADER_KEY
const X_PROXY_HEADER_SECRET = process.env.PROXY_HEADER_SECRET

/**
 * Creates a new Headers object with the current incoming request headers.
 * Used to pass request headers to layered API calls, e.g.: server component -> API route
 */
export function proxyRequestHeaders(): Headers {
  const requestHeaders = new Headers(headers())
  if (X_PROXY_HEADER_KEY && X_PROXY_HEADER_SECRET && !requestHeaders.has(X_PROXY_HEADER_KEY)) {
    requestHeaders.set(X_PROXY_HEADER_KEY, X_PROXY_HEADER_SECRET)
  }
  return requestHeaders
}

/**
 * Checks if the request has the correct proxy header key and secret.
 * Should only be used in the middleware to skip user session refresh.
 */
export function isProxyRequest(request: Request): boolean {
  return Boolean(
    X_PROXY_HEADER_KEY &&
      X_PROXY_HEADER_SECRET &&
      request.headers.get(X_PROXY_HEADER_KEY) === X_PROXY_HEADER_SECRET
  )
}
