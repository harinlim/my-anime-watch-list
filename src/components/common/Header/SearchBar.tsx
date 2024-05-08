import { Autocomplete, NativeSelect, rem } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

import styles from './Header.module.css'

const data = [
  { value: 'anime', label: 'Anime' },
  { value: 'watchlists', label: 'Watchlists' },
]

export function SearchBar() {
  return (
    <Autocomplete
      className={styles.search}
      placeholder="Search"
      leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
      rightSection={
        <NativeSelect
          data={data}
          rightSectionWidth={28}
          styles={{
            input: {
              fontWeight: 500,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              width: rem(110),
              marginRight: rem(-2),
            },
          }}
        />
      }
      rightSectionWidth={92}
      visibleFrom="xs"
    />
  )
}
