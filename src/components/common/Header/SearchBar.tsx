'use client'

import { TextInput, NativeSelect, rem, Button } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconSearch } from '@tabler/icons-react'
import clsx from 'clsx'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

import type { MantineSize } from '@mantine/core'

type SearchType = '/anime' | '/watchlists'

const SEARCH_TYPES = [
  { value: '/anime', label: 'Anime' },
  { value: '/watchlists', label: 'Watchlists' },
] as const satisfies { value: SearchType; label: string }[]

const SEARCH_PLACEHOLDERS = {
  '/anime': 'Search for anime',
  '/watchlists': 'Search for watchlists',
} as const satisfies Record<SearchType, string>

type Props = {
  defaultSearch?: string
  defaultType?: SearchType
  overrideType?: SearchType
  includeSearchType?: boolean
  includeSubmit?: boolean
  includeSearchParams?: boolean
  size?: MantineSize
  className?: string
}

function getSearchTypeFromPathname(pathname: string): SearchType | undefined {
  return SEARCH_TYPES.find(({ value }) => pathname.startsWith(value))?.value
}

// TODO: Add submit button when including type
export function SearchBar({
  defaultSearch = '',
  defaultType = '/anime',
  overrideType,
  includeSearchType = false,
  includeSubmit = false,
  includeSearchParams = false,
  size,
  className,
}: Props) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      search: (includeSearchParams ? searchParams.get('search') : null) ?? defaultSearch,
      type: overrideType ?? getSearchTypeFromPathname(pathname) ?? defaultType,
    },
  })

  const handleSubmit = form.onSubmit(values => {
    setIsLoading(true)
    const search = values.search.trim()
    router.push(
      `${values.type}?search=${search}${searchParams.get('sort') ? `&sort=${searchParams.get('sort')}` : ''}`
    )
    setIsLoading(false)
  })

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx('relative flex justify-center focus-within:z-10', className)}
    >
      <TextInput
        className="flex-grow"
        styles={{
          input: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
        size={size}
        placeholder={overrideType ? SEARCH_PLACEHOLDERS[overrideType] : 'Search'}
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        {...form.getInputProps('search')}
      />
      {includeSearchType && (
        <NativeSelect
          aria-label="Select search type"
          rightSectionWidth={28}
          size={size}
          styles={{
            input: {
              display: 'inline-flex',
              fontWeight: 500,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              width: rem(110),
            },
          }}
          required
          {...form.getInputProps('type')}
        >
          {SEARCH_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </NativeSelect>
      )}
      {includeSubmit && (
        <Button
          type="submit"
          disabled={isLoading}
          variant="gradient"
          size={size}
          className="right-0 top-0 rounded-l-none"
        >
          Search
        </Button>
      )}
    </form>
  )
}
