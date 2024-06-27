import { useMemo, useRef } from 'react'

import type { ResponseWithDataPaginated } from '@/types/api'

export const useTotalPages = <T extends ResponseWithDataPaginated<unknown>>(
  initialData: Extract<T, { ok: true }> | null,
  data?: T
) => {
  const totalPagesRef = useRef<number>(
    initialData ? Math.ceil(initialData.meta.total / initialData.meta.limit) : 1
  )

  const totalPages = useMemo(() => {
    if (!data?.meta) {
      return totalPagesRef.current
    }
    totalPagesRef.current = Math.ceil(data.meta.total / data.meta.limit)
    return totalPagesRef.current
  }, [data?.meta])

  return totalPages
}
