import { AspectRatio, Center, Grid, GridCol, Image } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import type { WatchlistOverview } from '@/types/watchlists'

type Props = {
  watchlist: WatchlistOverview
  hasPlus?: boolean
  className?: string
}

type AnimeOverview = WatchlistOverview['anime'][number]

const COLORS = [
  'bg-sky-300 dark:bg-zinc-800',
  'bg-sky-200 dark:bg-zinc-700',
  'bg-sky-200 dark:bg-zinc-700',
  'bg-sky-100 dark:bg-zinc-600',
]

export function WatchlistCoverPhoto({ watchlist, hasPlus = false, className }: Props) {
  const topAnime = watchlist.anime
    .map((anime: AnimeOverview) => ({ imageUrl: anime.poster_image.tiny, title: anime.title }))
    .filter(anime => anime.imageUrl !== undefined)

  return (
    <Grid gutter="0" className={className}>
      {COLORS.map((color, i) => (
        // eslint-disable-next-line react/no-array-index-key -- use the color index
        <GridCol key={`${watchlist.id}-cover-${i}`} span={6}>
          <AspectRatio ratio={1 / 1} className={`w-full ${color}`}>
            {topAnime.length > i && <Image src={topAnime[i].imageUrl} alt={topAnime[i].title} />}
            {topAnime.length <= i && <Center>{hasPlus && <IconPlus />}</Center>}
            {topAnime.length === 0}
          </AspectRatio>
        </GridCol>
      ))}
    </Grid>
  )
}
