'use client'

import { Select } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import type { SearchAnimeSortType } from '../(api)/api/anime/types'

const SORT_TYPES = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Rating' },
  { value: 'users', label: 'Users' },
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
] as const satisfies { value: SearchAnimeSortType; label: string }[]

export function SortAnimeDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPath = usePathname()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    router.replace(`${currentPath}?${params.toString()}`)
  }

  return (
    <Select
      aria-label="Sort by"
      placeholder="Sort by"
      onOptionSubmit={handleChange}
      className="w-32"
      defaultValue={searchParams.get('sort') ?? 'popularity'}
      rightSection={<IconChevronDown size={16} className="stroke-black dark:stroke-white" />}
      data={SORT_TYPES}
    />
  )
}
