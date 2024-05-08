import { headers } from 'next/headers'

export async function fetchWithType<T>(
  url: string | URL | Request,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, options)
  // console.log(response)
  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return response.json() as T
}

export function withBaseURL(route: string) {
  const host = headers().get('host')
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https'
  return `${protocol}://${host}${route}`
}
