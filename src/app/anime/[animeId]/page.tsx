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
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'

import { Review } from '@/components/anime/Review'
import { fetchWithType, withBaseURL } from '@/lib/api'
import { getAnimeRatingColor } from '@/utils/anime-colors'

import styles from './anime-page.module.css'
import { WatchlistSelect } from './WatchlistSelect'

import type { GetAnimeByIdResponse } from '@/api/anime/[animeId]/types'
import type { User } from '@/types/users'

export default async function AnimePage({ params }: { params: { animeId: string } }) {
  const { animeId } = params

  const animeResponse = await fetchWithType<GetAnimeByIdResponse>(
    withBaseURL(`/api/anime/${animeId}`),
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers(headers()),
    }
  )

  const { data: user } = await fetchWithType<User>(withBaseURL('/api/users'), {
    method: 'GET',
    credentials: 'include',
    headers: new Headers(headers()),
  })

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
    <div className="mt-10 flex w-full items-center justify-center">
      <div className="flex-col items-center lg:w-[70%]">
        <Title order={1} className="w-full px-[32px] text-center text-4xl md:text-left lg:text-5xl">
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
              <Text mt={10} className={styles.label} c="dimmed">
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
              <Text mt="md" className={styles.label} c="dimmed">
                Genres
              </Text>
              <Group gap={7} mt={5}>
                {genres.map(category => (
                  <Badge key={category}>{category}</Badge>
                ))}
              </Group>
            </CardSection>

            <CardSection className={styles.section}>
              <Text mt="md" className={styles.label} c="dimmed">
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
                <WatchlistSelect
                  animeId={animeId}
                  username={user.username}
                  addedWatchlists={addedWatchlistSet}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
