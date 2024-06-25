'use client'

import { Text, Rating } from '@mantine/core'
import { useCallback, useState } from 'react'

import { useUpdateAnimeRating } from '@/data/use-patch-anime-review'

import { AnimeStatusDropdown } from './AnimeStatusDropdown'
import styles from './Review.module.css'

import type { WatchStatus } from '@/types/enums'

type Props = {
  animeId: string
  status?: WatchStatus | null
  rating?: number | null
}

export function Review({ animeId, status = null, rating = null }: Props) {
  const [ratingValue, setRatingValue] = useState(rating ?? 0)
  const [statusValue, setStatusValue] = useState<WatchStatus | null>(status)

  const { mutate: updateRating } = useUpdateAnimeRating(animeId)

  const handleChangeRating = useCallback(
    (val: number) => {
      setRatingValue(val)
      void updateRating(val)
    },
    [updateRating]
  )

  return (
    <div className="mt-4">
      <Text mb="3" className={styles.label}>
        {!statusValue && 'Add '}Your Status:
      </Text>
      <AnimeStatusDropdown animeId={animeId} status={statusValue} onChange={setStatusValue} />

      <Text mt="10" className={styles.label}>
        {ratingValue === 0 && 'Add '}Your Rating:
      </Text>
      <Rating fractions={2} value={ratingValue} onChange={handleChangeRating} />
    </div>
  )
}
