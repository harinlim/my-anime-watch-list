import {
  Text,
  useCombobox,
  Combobox,
  InputBase,
  ComboboxDropdown,
  ComboboxOptions,
  ComboboxTarget,
  ComboboxChevron,
} from '@mantine/core'
import { useCallback, useState } from 'react'

import { useUpdateAnimeStatus } from '@/data/use-patch-anime-review'

import type { WatchStatus } from '@/types/enums'

// TODO: Consider making these badges instead of colored text

type Props = {
  animeId: string
  status?: WatchStatus | null
  onChange?: (status: WatchStatus) => void
  defaultColor?: `text-${string}-${number}`
  defaultText?: string
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

export function AnimeStatusDropdown({
  animeId,
  status = null,
  onChange,
  defaultText = 'Add status',
  defaultColor = 'text-gray-600',
}: Props) {
  const [statusValue, setStatusValue] = useState<WatchStatus | null>(status)

  const { mutate: updateStatus } = useUpdateAnimeStatus(animeId)

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
      <Text className={STATUS_COLOR[key as WatchStatus]}>{option}</Text>
    </Combobox.Option>
  ))

  const handleChangeStatus = useCallback(
    (val: string) => {
      const newStatus = val as WatchStatus
      setStatusValue(newStatus)
      onChange?.(newStatus)
      void updateStatus(newStatus)
      combobox.closeDropdown()
    },
    [updateStatus, onChange, combobox]
  )

  return (
    <Combobox store={combobox} resetSelectionOnOptionHover onOptionSubmit={handleChangeStatus}>
      <ComboboxTarget targetType="button">
        <InputBase
          className="h-auto"
          component="button"
          type="button"
          radius="md"
          pointer
          rightSection={<ComboboxChevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          <Text className={statusValue ? STATUS_COLOR[statusValue] : defaultColor}>
            {statusValue ? STATUS_TEXT[statusValue] : defaultText}
          </Text>
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown>
        <ComboboxOptions>{options}</ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  )
}
