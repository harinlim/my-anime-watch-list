import { AspectRatio, Center, Grid, GridCol, Image } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import type { WatchlistOverview } from '@/types/watchlists'

type WatchlistCardProps = {
  watchlist: WatchlistOverview
  hasPlus: boolean
}

type AnimeOverview = WatchlistOverview['anime'][number]

const COLORS = [
  'bg-sky-300 dark:bg-zinc-800',
  'bg-sky-200 dark:bg-zinc-700',
  'bg-sky-200 dark:bg-zinc-700',
  'bg-sky-100 dark:bg-zinc-600',
]

export function WatchlistCoverPhoto({ watchlist, hasPlus }: WatchlistCardProps) {
  const imageLinks = watchlist.anime
    .map((anime: AnimeOverview) => anime.poster_image.tiny)
    .filter((image): image is string => image !== undefined)

  return (
    <Grid gutter="0">
      {COLORS.map((color, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <GridCol key={watchlist.title + i} span={6}>
          <AspectRatio ratio={1 / 1} className={`w-full ${color}`}>
            {imageLinks.length > i && <Image src={imageLinks[i]} />}
            {imageLinks.length <= i && <Center>{hasPlus && <IconPlus />}</Center>}
            {imageLinks.length === 0}
          </AspectRatio>
        </GridCol>
      ))}
    </Grid>
  )
}
