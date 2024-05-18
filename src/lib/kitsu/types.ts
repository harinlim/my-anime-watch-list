import type { ExpandOne } from '@/types/utils'

type Dimensions = { width: number; height: number }

type Size = 'tiny' | 'small' | 'medium' | 'large'

type SizeRecord<TSize extends Size, T> = { [key in TSize]?: T }

export type ImageMetadata<TSizes extends Size = Size> = SizeRecord<TSizes, string | undefined> & {
  original: string
  meta: {
    // This doesn't cover conditional case where the corresponding dimension size
    // is only present when the record link exists, but we'll use this for now
    dimensions: SizeRecord<TSizes, Dimensions | undefined>
  }
}

type ResourceLinks = {
  self: string
}

export type PaginationMetadata = {
  count: number
}

export type PaginationLinks = {
  first: string
  last: string
  // If page number falls outside of the ends
  prev?: string
  next?: string
}

type AnimeAttributes = {
  slug: string
  synopsis: string
  /** Comes in with keys `en`, `en_us`, `en_jp`, `en_cn`, etc., but per anime */
  titles: Record<string, string>
  canonicalTitle: string
  abbreviatedTitles: string[]
  averageRating: string
  userCount: number
  favoritesCount: number
  startDate: string
  endDate: string
  popularityRank: number
  ratingRank: number
  ageRating: string
  subtype: 'ONA' | 'OVA' | 'TV' | 'movie' | 'music' | 'special'
  status: 'current' | 'finished' | 'tba' | 'unreleased' | 'upcoming'
  posterImage: ImageMetadata<Size> | null
  coverImage: ImageMetadata<Exclude<Size, 'medium'>> | null
  episodeCount: number
  episodeLength: number
  youtubeVideoId: string | null
  nsfw: boolean
}

export const ANIME_ATTRIBUTES = [
  'slug',
  'synopsis',
  'titles',
  'canonicalTitle',
  'abbreviatedTitles',
  'averageRating',
  'userCount',
  'favoritesCount',
  'startDate',
  'endDate',
  'popularityRank',
  'ratingRank',
  'ageRating',
  'subtype',
  'status',
  'posterImage',
  'coverImage',
  'episodeCount',
  'episodeLength',
  'youtubeVideoId',
  'nsfw',
] as const satisfies (keyof AnimeAttributes)[]

type AnimeData = {
  id: string
  type: 'anime'
  links: ResourceLinks
  attributes: AnimeAttributes
}

type CategoryAttributes = {
  title: string
}

export const CATEGORY_ATTRIBUTES = ['title'] as const satisfies (keyof CategoryAttributes)[]

type CategoryData = ExpandOne<{
  id: string
  type: 'categories'
  links: ResourceLinks
  attributes: CategoryAttributes
}>
export type GetAnimeByIdResponse = {
  data: AnimeData
  included?: CategoryData[] | null
}

type AnimeDataDeserialized = ExpandOne<
  {
    id: string
    type: 'anime'
    links: ResourceLinks
  } & AnimeAttributes
>

export type GetAnimeByIdDeserializedResponse = ExpandOne<{
  data: AnimeDataDeserialized & {
    categories: string[] | null
  }
}>

export type SearchAnimeResponse = ExpandOne<{
  data: AnimeData[]
  meta: PaginationMetadata
  links: PaginationLinks
}>

export type SearchAnimeDeserializedResponse = ExpandOne<{
  data: AnimeDataDeserialized[]
  meta: PaginationMetadata
  links: PaginationLinks
}>

export const SEARCH_ANIME_SORT_TYPES = [
  'popularity',
  'rating',
  'users',
  'latest',
  'oldest',
] as const
export type SearchAnimeSortType = (typeof SEARCH_ANIME_SORT_TYPES)[number]

export const SEARCH_ANIME_SORT_MAPPING = {
  popularity: 'popularityRank',
  rating: 'ratingRank',
  users: '-userCount',
  latest: '-startDate',
  oldest: 'startDate',
} as const satisfies Record<SearchAnimeSortType, `${'-' | ''}${keyof AnimeAttributes}`>

export type SearchAnimeQueryParams = {
  sort?: SearchAnimeSortType | null
  page?: number | string | null
  limit?: number | string | null
  search?: string | null
  id?: string | string[] | number | number[] | null
}

export type KitsuErrorResponse = {
  errors: {
    title: string
    detail: string
    code: string
    status: string
  }[]
}

/*
{
  data: {
    id: '43905',
    type: 'anime',
    links: { self: 'https://kitsu.io/api/edge/anime/43905' },
    attributes: {
      slug: 'wu-liuqi-zhi-xuanwu-guo-pian',
      synopsis: 'In order to protect the residents of Xiaoji Island and the peaceful life here, Wu Liuqi and his partners Dabao and Xiaofei embark on a journey to the Xuanwu Kingdom to find out the truth about his identity and a way to save the island. Waiting for them is more unknowns and adventures.\n' +
        '\n' +
        '(Source: bilibili, edited)',
      coverImageTopOffset: 0,
      titles: [Object],
      canonicalTitle: 'Wu Liuqi Zhi Xuanwu Guo Pian',
      abbreviatedTitles: [Array],
      averageRating: '81.7',
      userCount: 2948,
      favoritesCount: 15,
      startDate: '2021-01-27',
      endDate: '2021-05-05',
      popularityRank: 3653,
      ratingRank: 379,
      ageRating: 'PG',
      status: 'finished',
      posterImage: [Object],
      coverImage: null,
      episodeCount: 10,
      episodeLength: 15,
      nsfw: false
    }
  },
  included: [
    {
      id: '150',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '157',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '160',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '184',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '30',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '234',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    },
    {
      id: '47',
      type: 'categories',
      links: [Object],
      attributes: [Object]
    }
  ]
}
{
  data: {
    id: '43905',
    type: 'anime',
    links: { self: 'https://kitsu.io/api/edge/anime/43905' },
    slug: 'wu-liuqi-zhi-xuanwu-guo-pian',
    synopsis: 'In order to protect the residents of Xiaoji Island and the peaceful life here, Wu Liuqi and his partners Dabao and Xiaofei embark on a journey to the Xuanwu Kingdom to find out the truth about his identity and a way to save the island. Waiting for them is more unknowns and adventures.\n' +
      '\n' +
      '(Source: bilibili, edited)',
    titles: {
      en: 'Scissor Seven Season 3',
      en_cn: 'Wu Liuqi Zhi Xuanwu Guo Pian',
      zh_cn: '伍六七之玄武国篇'
    },
    canonicalTitle: 'Wu Liuqi Zhi Xuanwu Guo Pian',
    abbreviatedTitles: [ 'Cike Wu Liuqi 3rd Season', 'Killer Seven 3rd Season' ],
    averageRating: '81.7',
    userCount: 2948,
    favoritesCount: 15,
    startDate: '2021-01-27',
    endDate: '2021-05-05',
    popularityRank: 3653,
    ratingRank: 379,
    ageRating: 'PG',
    status: 'finished',
    posterImage: {
      tiny: 'https://media.kitsu.io/anime/poster_images/43905/tiny.jpg',
      large: 'https://media.kitsu.io/anime/poster_images/43905/large.jpg',
      small: 'https://media.kitsu.io/anime/poster_images/43905/small.jpg',
      medium: 'https://media.kitsu.io/anime/poster_images/43905/medium.jpg',
      original: 'https://media.kitsu.io/anime/poster_images/43905/original.png',
      meta: [Object]
    },
    coverImage: null,
    episodeCount: 10,
    episodeLength: 15,
    nsfw: false
  }
}
*/
