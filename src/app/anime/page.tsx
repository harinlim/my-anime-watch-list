import { Group, Title } from '@mantine/core'

import { AnimeList } from '@/components/anime/AnimeList'
import { SearchBar } from '@/components/common/Header/SearchBar'

import { SortAnimeDropdown } from './SortAnimeDropdown'

export default function AnimePage() {
  return (
    <div className="min-w-screen mt-10 flex flex-col items-center justify-center space-y-6">
      <div className="mb-10 flex w-full flex-col flex-nowrap items-center justify-center lg:w-4/5">
        <Title order={1} className="mb-10 text-5xl font-extrabold">
          Anime Search
        </Title>
        <SearchBar
          overrideType="/anime"
          includeSearchParams
          includeSubmit
          className="w-4/5 md:w-3/5"
        />
        <Group className="my-5 w-4/5 justify-center sm:justify-end">
          Sort by:
          <SortAnimeDropdown />
        </Group>
        <AnimeList />
      </div>
    </div>
  )
}
