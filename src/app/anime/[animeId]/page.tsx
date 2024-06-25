import {
  Badge,
  Card,
  Divider,
  Image,
  Title,
  Text,
  CardSection,
  TableTr,
  TableTd,
  Table,
  TableTbody,
  Group,
} from '@mantine/core'
import clsx from 'clsx'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { Review } from '@/components/anime/Review'
import {
  OpenWatchlistModalButton,
  WatchlistModalProvider,
} from '@/components/watchlists/WatchlistModal'
import { getUserFromSession } from '@/db/users'
import { fetchWithType } from '@/lib/api'
import { proxyRequestHeaders } from '@/lib/headers'
import { createServerClient } from '@/lib/supabase/server'
import { withBaseURL } from '@/lib/url'

import styles from './anime-page.module.css'
import { WatchlistSelectModal } from './WatchlistSelectModal'

import type { GetAnimeByIdResponse } from '@/api/anime/[animeId]/types'

function getAnimeRatingColor(
  rating: number
): `text-${string}-${number} dark:text-${string}-${number}` {
  if (rating >= 80) {
    return 'text-emerald-700 dark:text-emerald-400'
  }
  if (rating >= 70) {
    return 'text-lime-700 dark:text-lime-400'
  }
  if (rating >= 60) {
    return 'text-yellow-700 dark:text-yellow-400'
  }
  if (rating >= 50) {
    return 'text-orange-700 dark:text-orange-400'
  }
  return 'text-red-600 dark:text-red-400'
}

export default async function AnimePage({ params }: { params: { animeId: string } }) {
  const { animeId } = params

  const supabase = createServerClient()
  const { data: user } = await getUserFromSession(supabase)

  const animeResponse = await fetchWithType<GetAnimeByIdResponse>(
    withBaseURL(`/api/anime/${animeId}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: proxyRequestHeaders(),
    }
  )

  // Show not found for client errors
  if (animeResponse.status >= 400 && animeResponse.status < 500) {
    return notFound()
  }

  // Show 500 for all other errors
  if (!animeResponse.ok) {
    throw new Error('Failed to fetch anime')
  }

  const { data } = animeResponse
  if (!data) {
    throw new Error('Failed to parse anime')
  }

  const genres = data.categories ?? []
  const rating = Number(data.averageRating)
  const ratingColor = getAnimeRatingColor(rating)

  const addedWatchlistSet = new Set<number>(data.watchlists?.map(watchlist => watchlist.id) ?? [])

  return (
    <WatchlistModalProvider>
      <div className="mt-10 flex w-full items-center justify-center">
        <div className="flex-col items-center lg:w-[70%]">
          <Title
            order={1}
            className="w-full px-[32px] text-center text-4xl md:text-left lg:text-5xl"
          >
            {data.canonicalTitle} {data.titles.ja_jp && `(${data.titles.ja_jp})`}
          </Title>
          <div className="flex flex-col flex-wrap items-center space-y-6 p-8 sm:flex-row sm:flex-nowrap sm:items-start sm:space-y-0">
            <Card withBorder radius="md" p="xl" className={clsx(styles.card, 'min-w-[300px]')}>
              <Image src={data.posterImage?.small} alt={data.canonicalTitle} radius="md" />
              <CardSection className={styles.section}>
                {/* <Title mt={10} order={2} className="py-3 md:text-3xl">
                {data.canonicalTitle}
              </Title> */}
              </CardSection>

              {user && (
                <CardSection className={styles.section}>
                  <Review
                    animeId={animeId}
                    status={data.review?.status}
                    rating={data.review?.rating}
                  />
                </CardSection>
              )}
              <CardSection className={styles.section}>
                <Text mt={10} className="text-base font-semibold uppercase">
                  Titles
                </Text>
                <Table>
                  <TableTbody>
                    {(data.titles.en || data.titles.en_us) && (
                      <TableTr>
                        <TableTd>English</TableTd>
                        <TableTd>{data.titles.en || data.titles.en_us}</TableTd>
                      </TableTr>
                    )}
                    {data.titles.ja_jp && (
                      <TableTr>
                        <TableTd>Japanese</TableTd>
                        <TableTd>{data.titles.ja_jp}</TableTd>
                      </TableTr>
                    )}
                    {data.titles.zh_cn && (
                      <TableTr>
                        <TableTd>Chinese</TableTd>
                        <TableTd>{data.titles.zh_cn}</TableTd>
                      </TableTr>
                    )}
                    {data.titles.en_jp && (
                      <TableTr>
                        <TableTd>Romanization (JP)</TableTd>
                        <TableTd>{data.titles.en_jp}</TableTd>
                      </TableTr>
                    )}
                    {data.titles.en_cn && (
                      <TableTr>
                        <TableTd>Romanization (CN)</TableTd>
                        <TableTd>{data.titles.en_cn}</TableTd>
                      </TableTr>
                    )}
                  </TableTbody>
                </Table>
              </CardSection>

              <CardSection className={styles.section}>
                <Text mt="md" className="text-base font-semibold uppercase">
                  Genres
                </Text>
                <Group gap={7} mt={5}>
                  {genres.map(category => (
                    <Badge key={category} autoContrast color="indigo.7">
                      {category}
                    </Badge>
                  ))}
                </Group>
              </CardSection>

              <CardSection className={styles.section}>
                <Text mt="md" className="text-base font-semibold uppercase">
                  Average Rating: &nbsp;
                  <Text component="span" className={ratingColor}>
                    {data.averageRating}
                  </Text>
                </Text>
              </CardSection>
            </Card>

            <div className="h-[100%] min-w-[275px] max-w-[500px] sm:pl-10">
              <Title order={2}>Synopsis</Title>
              <Divider mt={5} />
              <Text mt={5}>{data.synopsis}</Text>

              {user && (
                <div className="mt-12">
                  <Title order={2}>Actions</Title>
                  <Suspense fallback={<OpenWatchlistModalButton className="my-4" disabled />}>
                    <OpenWatchlistModalButton className="my-4" />

                    <WatchlistSelectModal
                      animeId={animeId}
                      username={user.username}
                      addedWatchlists={addedWatchlistSet}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WatchlistModalProvider>
  )
}
