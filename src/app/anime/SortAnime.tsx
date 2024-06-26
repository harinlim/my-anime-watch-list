'use client'

import { Select } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SortAnime() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    router.push(
      `anime?${searchParams.get('search') ? `search=${searchParams.get('search')}&` : ''}sort=${value}`
    )
  }

  return (
    <Select
      aria-label="Sort by"
      placeholder="Sort by"
      onOptionSubmit={handleChange}
      className="w-32"
      defaultValue={searchParams.get('sort') ?? 'popularity'}
      rightSection={<IconChevronDown size={16} className="stroke-black dark:stroke-white" />}
      data={[
        { value: 'popularity', label: 'Popularity' },
        { value: 'rating', label: 'Rating' },
        { value: 'users', label: 'Users' },
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
      ]}
    />
  )
}
