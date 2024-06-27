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
import type { InputBaseProps } from '@mantine/core'
import type { AriaAttributes } from 'react'

// TODO: Consider making these badges instead of colored text

type Props = {
  animeId: string
  status?: WatchStatus | null
  onChange?: (status: WatchStatus) => void
  defaultColor?: `text-${string}-${number} dark:text-${string}-${number}`
  defaultText?: string
} & InputBaseProps &
  AriaAttributes

const STATUS_TEXT = {
  planned: 'Plan to Watch',
  watching: 'Watching',
  completed: 'Completed',
  dropped: 'Dropped',
} as const satisfies Record<WatchStatus, string>

const STATUS_COLOR = {
  planned: 'text-blue-600 dark:text-blue-400',
  watching: 'text-yellow-700 dark:text-yellow-500',
  completed: 'text-emerald-700 dark:text-emerald-500',
  dropped: 'text-red-600 dark:text-red-400',
} as const satisfies Record<WatchStatus, `text-${string}-${number} dark:text-${string}-${number}`>

export function AnimeStatusDropdown({
  animeId,
  status = null,
  onChange,
  defaultText = 'Add status',
  defaultColor = 'text-gray-600 dark:text-gray-400',
  ...rest
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
          {...rest}
        >
          <Text className={statusValue ? STATUS_COLOR[statusValue] : defaultColor}>
            {statusValue ? STATUS_TEXT[statusValue] : defaultText}
          </Text>
        </InputBase>
      </ComboboxTarget>

      <ComboboxDropdown>
        <ComboboxOptions
          {...{
            'aria-labelledby': rest['aria-labelledby'],
            'aria-describedby': rest['aria-describedby'],
            'aria-label': rest['aria-label'],
          }}
        >
          {options}
        </ComboboxOptions>
      </ComboboxDropdown>
    </Combobox>
  )
}
