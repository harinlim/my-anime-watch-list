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

import { GET_ANIME_BY_ID_RESPONSE_MOCK } from '@/app/api/anime/[animeId]/mock'
import { Review } from '@/components/common/Review'
import { fetchWithType, withBaseURL } from '@/lib/api'

import styles from './anime-page.module.css'

import type { GetAnimeByIdResponse } from '@/api/anime/[animeId]/types'
import type { User } from '@/api/users/types'

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

  // const data = animeResponse.data
  const data = GET_ANIME_BY_ID_RESPONSE_MOCK
  const genres = data.categories.map(category => <Badge key={category}>{category}</Badge>)
  let ratingColor = 'text-red-600'
  const rating = Number(data.averageRating)

  if (rating >= 90) {
    ratingColor = 'text-emerald-600'
  } else if (rating >= 80) {
    ratingColor = 'text-lime-600'
  } else if (rating >= 70) {
    ratingColor = 'text-yellow-600'
  } else if (rating >= 60) {
    ratingColor = 'text-orange-600'
  }

  return (
    <div className="mt-10 w-full flex items-center justify-center">
      <div className="lg:w-[70%] flex-col items-center">
        <Title order={1} className="px-[32px] lg:text-5xl text-4xl w-full text-center md:text-left">
          {data.canonicalTitle} ({data.titles.ja_jp && data.titles.ja_jp})
        </Title>
        <div className="flex sm:flex-row sm:flex-nowrap flex-col flex-wrap sm:items-start items-center space-y-6 sm:space-y-0 p-8">
          <Card withBorder radius="md" p="xl" className={clsx(styles.card, 'min-w-[300px]')}>
            <Image src={data.posterImage.small} alt={data.canonicalTitle} radius="md" />
            <CardSection className={styles.section}>
              {/* <Title mt={10} order={2} className="py-3 md:text-3xl">
                {data.canonicalTitle}
              </Title> */}
            </CardSection>
            {user && (
              <CardSection className={styles.section}>
                <Review status={data.review?.status} rating={data.review?.rating} />
              </CardSection>
            )}
            <CardSection className={styles.section}>
              <Text mt={10} className={styles.label} c="dimmed">
                Titles
              </Text>
              <Table>
                <TableTbody>
                  {data.titles.en && (
                    <TableTr>
                      <TableTd>English</TableTd>
                      <TableTd>{data.titles.en}</TableTd>
                    </TableTr>
                  )}
                  {data.titles.ja_jp && (
                    <TableTr>
                      <TableTd>Japanese</TableTd>
                      <TableTd>{data.titles.ja_jp}</TableTd>
                    </TableTr>
                  )}
                  {data.titles.en_jp && (
                    <TableTr>
                      <TableTd>Romanization)</TableTd>
                      <TableTd>{data.titles.en_jp}</TableTd>
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
                {genres}
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
          <div className="sm:pl-10 h-[100%] min-w-[275px] max-w-[500px]">
            <Title order={2}>Synopsis</Title>
            <Divider mt={5} />
            <Text mt={5}>{data.synopsis}</Text>
          </div>
          {/* <h1>Anime</h1>
        <div>
          <pre className="items-left text-pretty">{JSON.stringify(data, null, 2)}</pre>
        </div> */}
        </div>
      </div>
    </div>
  )
}
