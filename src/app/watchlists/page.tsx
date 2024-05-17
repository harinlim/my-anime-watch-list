import { Title } from '@mantine/core'

import { SearchBar } from '@/components/common/Header/SearchBar'
import { WatchlistsList } from '@/components/watchlists/WatchlistsList'

export default function WatchlistsPage() {
  return (
    <div className="min-w-screen mt-10 flex flex-col items-center justify-center space-y-6">
      <div className="lg:max-w-4/5 mb-10 flex w-full flex-col flex-nowrap items-center justify-center">
        <Title order={1} className="mb-10 text-5xl font-extrabold">
          Watchlists Search
        </Title>
        <SearchBar
          overrideType="/watchlists"
          includeSearchParams
          includeSubmit
          className="mb-10 w-4/5 md:w-3/5"
        />
        <WatchlistsList />
      </div>
    </div>
  )
}
