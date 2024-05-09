'use client'

import { Text, Rating, useCombobox, Combobox, InputBase } from '@mantine/core'
import { useState } from 'react'

import styles from './Review.module.css'

import type { WatchStatus } from '@/types/enums'

const statusText = {
  planned: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
  dropped: 'Dropped',
}

export function Review({ status, rating }: { status?: WatchStatus; rating?: number }) {
  const translate = (input?: WatchStatus) => {
    switch (input) {
      case undefined: {
        return 'Add Status'
      }
      default: {
        return statusText[input]
      }
    }
  }

  const statusColor = (input?: WatchStatus) => {
    switch (input) {
      case 'planned': {
        return 'text-blue-600'
      }
      case 'watching': {
        return 'text-yellow-600'
      }
      case 'completed': {
        return 'text-emerald-600'
      }
      case 'dropped': {
        return 'text-red-600'
      }
      default: {
        return 'text-gray-600'
      }
    }
  }

  const [ratingValue, setRatingValue] = useState(rating ?? 0)
  const [statusValue, setStatusValue] = useState<WatchStatus | undefined>(status)

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

  const options = Object.entries(statusText).map(([key, option]) => (
    <Combobox.Option key={key} value={key}>
      {option}
    </Combobox.Option>
  ))

  return (
    <div className="mt-4">
      <Text mb="3" className={styles.label}>
        {!statusValue && 'Add '}Your Status:
      </Text>
      <Combobox
        store={combobox}
        resetSelectionOnOptionHover
        onOptionSubmit={val => {
          setStatusValue(val as WatchStatus)
          combobox.updateSelectedOptionIndex('active')
        }}
      >
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
      <Rating fractions={2} value={ratingValue} onChange={setRatingValue} />
    </div>
  )
}
