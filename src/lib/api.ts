import { headers } from 'next/headers'

import type { ResponseWithData } from '@/types/api'

export async function fetchWithType<T extends object>(
  url: string | URL | Request,
  init: RequestInit = {}
): Promise<ResponseWithData<T>> {
  const response = await fetch(url, init)
  if (!response.ok) {
    return { data: null, status: response.status, ok: response.ok }
  }

  return { data: (await response.json()) as T, status: response.status, ok: response.ok }
}

export function withBaseURL(route: string) {
  const host = headers().get('host')
  const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https'
  return `${protocol}://${host}${route}`
}
