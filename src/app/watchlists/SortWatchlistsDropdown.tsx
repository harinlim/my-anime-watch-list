'use client'

import { Select } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type {
  SearchWatchlistsDirectionType,
  SearchWatchlistsSortType,
} from '../(api)/api/watchlists/types'

const SORT_MAPPING: Record<
  string,
  { sort: SearchWatchlistsSortType; direction: SearchWatchlistsDirectionType }
> = {
  asc_created_at: { sort: 'created_at', direction: 'asc' },
  desc_created_at: { sort: 'created_at', direction: 'desc' },
  asc_updated_at: { sort: 'updated_at', direction: 'asc' },
  desc_updated_at: { sort: 'updated_at', direction: 'desc' },
}

type SORT_MAPPING_KEY = keyof typeof SORT_MAPPING

const SORT_TYPES = [
  { value: 'desc_created_at', label: 'Newest' },
  { value: 'asc_created_at', label: 'Oldest' },
  { value: 'desc_updated_at', label: 'Recent Update' },
  { value: 'asc_updated_at', label: 'Oldest Update' },
] as const satisfies { value: SORT_MAPPING_KEY; label: string }[]

const getDefaultSortValue = (sort: string, direction: string) => {
  const defaultSortKey = Object.keys(SORT_MAPPING).find(
    key => SORT_MAPPING[key].sort === sort && SORT_MAPPING[key].direction === direction
  )

  return defaultSortKey ?? 'desc_updated_at'
}

export function SortWatchlistsDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPath = usePathname()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', SORT_MAPPING[value].sort)
    params.set('direction', SORT_MAPPING[value].direction)
    router.replace(`${currentPath}?${params.toString()}`)
  }

  return (
    <Select
      aria-label="Sort by"
      placeholder="Sort by"
      onOptionSubmit={handleChange}
      className="w-40"
      defaultValue={getDefaultSortValue(
        searchParams.get('sort') ?? 'updated_at',
        searchParams.get('direction') ?? 'desc'
      )}
      rightSection={<IconChevronDown size={16} className="stroke-black dark:stroke-white" />}
      data={SORT_TYPES}
    />
  )
}
