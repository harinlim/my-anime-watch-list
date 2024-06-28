'use client'

import { Text, Rating, Stack } from '@mantine/core'
import { useCallback, useState } from 'react'

import { useUpdateAnimeRating } from '@/data/use-patch-anime-review'

import { AnimeStatusDropdown } from './AnimeStatusDropdown'

import type { WatchStatus } from '@/types/enums'

type Props = {
  animeId: string
  status?: WatchStatus | null
  rating?: number | null
}

export function Review({ animeId, status = null, rating = null }: Props) {
  const [ratingValue, setRatingValue] = useState(rating ? rating / 2 : 0)
  const [statusValue, setStatusValue] = useState<WatchStatus | null>(status)

  const { mutate: updateRating } = useUpdateAnimeRating(animeId)

  const handleChangeRating = useCallback(
    (val: number) => {
      setRatingValue(val)
      void updateRating(val * 2)
    },
    [updateRating]
  )

  return (
    <div className="mt-4 flex flex-col gap-4">
      <Stack className="gap-2">
        <Text id="status-label" component="label" className="text-base font-semibold uppercase">
          {!statusValue && 'Add '}Your Status:
        </Text>
        <AnimeStatusDropdown
          aria-labelledby="status-label"
          defaultText="Not yet watched"
          animeId={animeId}
          status={statusValue}
          onChange={setStatusValue}
        />
      </Stack>

      <Stack className="gap-2">
        <Text id="rating-label" component="label" className="text-base font-semibold uppercase">
          {ratingValue === 0 && 'Add '}Your Rating:
        </Text>
        <Rating
          aria-labelledby="rating-label"
          fractions={2}
          value={ratingValue}
          onChange={handleChangeRating}
        />
      </Stack>
    </div>
  )
}
