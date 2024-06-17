'use client'

import { Text, Rating, useCombobox, Combobox, InputBase } from '@mantine/core'
import { useCallback, useState } from 'react'

import styles from './Review.module.css'

import type { WatchStatus } from '@/types/enums'

type Props = {
  animeId: string
  status?: WatchStatus | null
  rating?: number | null
}

const STATUS_TEXT = {
  planned: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
  dropped: 'Dropped',
} as const satisfies Record<WatchStatus, string>

const STATUS_COLOR = {
  planned: 'text-blue-600',
  watching: 'text-yellow-600',
  completed: 'text-emerald-600',
  dropped: 'text-red-600',
} as const satisfies Record<WatchStatus, `text-${string}-${number}`>

const RATING_SCALE = 2 // TODO: rename this

async function updateStatus(animeId: string, status: WatchStatus) {
  return fetch(`/api/anime/${animeId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

async function updateRating(animeId: string, rating: number) {
  return fetch(`/api/anime/${animeId}`, {
    method: 'PATCH',
    body: JSON.stringify({ rating }),
  })
}

export function Review({ animeId, status = null, rating = null }: Props) {
  const translate = (input?: WatchStatus | null) => {
    if (!input) return 'Add Status'

    return STATUS_TEXT[input]
  }

  const statusColor = (input?: WatchStatus | null) => {
    if (!input) return 'text-gray-600'

    return STATUS_COLOR[input]
  }

  const [ratingValue, setRatingValue] = useState(rating ?? 0)
  const [statusValue, setStatusValue] = useState<WatchStatus | null>(status)

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: eventSource => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption()
      } else {
        combobox.updateSelectedOptionIndex('active')
      }
    },
  })

  const options = Object.entries(STATUS_TEXT).map(([key, option]) => (
    <Combobox.Option key={key} value={key}>
      {option}
    </Combobox.Option>
  ))

  const handleChangeStatus = useCallback(
    (val: string) => {
      const newStatus = val as WatchStatus
      setStatusValue(newStatus)
      void updateStatus(animeId, newStatus)
      combobox.closeDropdown()
    },
    [animeId, combobox]
  )

  const handleChangeRating = useCallback(
    (val: number) => {
      setRatingValue(val)
      void updateRating(animeId, val * RATING_SCALE)
    },
    [animeId]
  )

  return (
    <div className="mt-4">
      <Text mb="3" className={styles.label}>
        {!statusValue && 'Add '}Your Status:
      </Text>
      <Combobox store={combobox} resetSelectionOnOptionHover onOptionSubmit={handleChangeStatus}>
        <Combobox.Target targetType="button">
          <InputBase
            component="button"
            type="button"
            radius="md"
            pointer
            rightSection={<Combobox.Chevron />}
            rightSectionPointerEvents="none"
            onClick={() => combobox.toggleDropdown()}
          >
            <Text className={statusColor(statusValue)}>{translate(statusValue)}</Text>
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <Text mt="10" className={styles.label}>
        {ratingValue === 0 && 'Add '}Your Rating:
      </Text>
      <Rating fractions={RATING_SCALE} value={ratingValue} onChange={handleChangeRating} />
    </div>
  )
}
