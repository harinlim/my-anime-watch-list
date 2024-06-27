import { Group, Title } from '@mantine/core'

import { SearchBar } from '@/components/common/Header/SearchBar'
import { WatchlistsList } from '@/components/watchlists/WatchlistsList'

import { CreateWatchlistButtonFixed } from './CreateWatchlistButtonFixed'
import { SortWatchlistsDropdown } from './SortWatchlistsDropdown'

export default function WatchlistsPage() {
  return (
    <div className="min-w-screen mt-10 flex flex-col items-center justify-center space-y-6">
      <div className="mb-10 flex w-full flex-col flex-nowrap items-center justify-center lg:max-w-7xl">
        <Title order={1} className="mb-10 w-5/6 text-center text-5xl font-extrabold">
          Watchlists Search
        </Title>
        <SearchBar
          overrideType="/watchlists"
          includeSearchParams
          includeSubmit
          className="w-4/5 md:w-3/5"
        />
        <Group className="my-5 w-5/6 justify-center sm:justify-end md:w-3/4">
          <CreateWatchlistButtonFixed />
          <Group>
            Sort by:
            <SortWatchlistsDropdown />
          </Group>
        </Group>

        <WatchlistsList />
      </div>
    </div>
  )
}
