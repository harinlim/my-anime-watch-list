import { Pagination as MantinePagination } from '@mantine/core'
import { memo } from 'react'

import type { PaginationProps } from '@mantine/core'

/** Re-exported Mantine Pagination with defaults */
export const Pagination = memo(({ total = 1, value = 1, ...props }: PaginationProps) => (
  <MantinePagination
    total={total}
    value={value}
    withEdges={total > 8}
    getControlProps={control => {
      // Required because mantine doesn't add default accessibility labels
      if (control === 'first') return { 'aria-label': 'First page' }
      if (control === 'previous') return { 'aria-label': 'Previous page' }
      if (control === 'next') return { 'aria-label': 'Next page' }
      if (control === 'last') return { 'aria-label': 'Last page' }
      return {}
    }}
    {...props}
  />
))
