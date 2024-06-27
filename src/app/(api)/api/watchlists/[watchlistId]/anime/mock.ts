import type { GetWatchlistAnimeResponse } from './types'
import type { AnimeByWatchlist } from '@/types/anime'

export const GET_ANIME_BY_WATCHLIST_RESPONSE_MOCK = {
  data: [
    {
      kitsu_id: '12',
      title: 'One Piece',
      synopsis:
        'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.\nEnter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy’s reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.\n[Written by MAL Rewrite]',
      created_at: '2024-05-09T18:18:51.379367+00:00',
      poster_image: {
        meta: {
          dimensions: {
            tiny: {
              width: 110,
              height: 156,
            },
            large: {
              width: 550,
              height: 780,
            },
            small: {
              width: 284,
              height: 402,
            },
            medium: {
              width: 390,
              height: 554,
            },
          },
        },
        tiny: 'https://media.kitsu.io/anime/poster_images/12/tiny.jpg',
        large: 'https://media.kitsu.io/anime/poster_images/12/large.jpg',
        small: 'https://media.kitsu.io/anime/poster_images/12/small.jpg',
        medium: 'https://media.kitsu.io/anime/poster_images/12/medium.jpg',
        original: 'https://media.kitsu.io/anime/poster_images/12/original.png',
      },
      review: {
        rating: 10,
        status: 'watching',
        updated_at: '2024-06-18T13:40:00.693993+00:00',
      },
    },
    {
      kitsu_id: '42196',
      title: 'Tensei shitara Slime Datta Ken 2',
      synopsis:
        'The second season of Tensei shitara Slime Datta Ken.\n\nA country built by our main character Rimuru and the many monsters who look up to him – the Jura Tempest Federation –, through agreements and trade with neighbouring countries, is the ideal “country where humans and monsters can walk alongside."\n\nRimuru has a tendency to “feel kindly towards humans”, because of its former nature as a human being ...\n\nHowever, there is a clear "hostility toward demons" that exists in this world.\nWhen faced with that unreasonable reality, Rimuru makes its choice.\n\n"Is there something that you don\'t want to lose?"\n\n(Source: Muse Asia)',
      created_at: '2024-05-16T01:18:20.068562+00:00',
      poster_image: {
        meta: {
          dimensions: {
            tiny: {
              width: 110,
              height: 156,
            },
            large: {
              width: 550,
              height: 780,
            },
            small: {
              width: 284,
              height: 402,
            },
            medium: {
              width: 390,
              height: 554,
            },
          },
        },
        tiny: 'https://media.kitsu.io/anime/poster_images/42196/tiny.jpg',
        large: 'https://media.kitsu.io/anime/poster_images/42196/large.jpg',
        small: 'https://media.kitsu.io/anime/poster_images/42196/small.jpg',
        medium: 'https://media.kitsu.io/anime/poster_images/42196/medium.jpg',
        original: 'https://media.kitsu.io/anime/poster_images/42196/original.jpg',
      },
      review: {
        rating: 10,
        status: 'completed',
        updated_at: '2024-05-18T19:28:58.330163+00:00',
      },
    },
    {
      kitsu_id: '1376',
      title: 'Death Note',
      synopsis:
        "A shinigami, as a god of death, can kill any person—provided they see their victim's face and write their victim's name in a notebook called a Death Note. One day, Ryuk, bored by the shinigami lifestyle and interested in seeing how a human would use a Death Note, drops one into the human realm.\n\nHigh school student and prodigy Light Yagami stumbles upon the Death Note and—since he deplores the state of the world—tests the deadly notebook by writing a criminal's name in it. When the criminal dies immediately following his experiment with the Death Note, Light is greatly surprised and quickly recognizes how devastating the power that has fallen into his hands could be.\n\nWith this divine capability, Light decides to extinguish all criminals in order to build a new world where crime does not exist and people worship him as a god. Police, however, quickly discover that a serial killer is targeting criminals and, consequently, try to apprehend the culprit. To do this, the Japanese investigators count on the assistance of the best detective in the world: a young and eccentric man known only by the name of L.\n\n(Source: MAL Rewrite)",
      created_at: '2024-05-09T18:17:42.936575+00:00',
      poster_image: {
        meta: {
          dimensions: {
            tiny: {
              width: 110,
              height: 156,
            },
            large: {
              width: 550,
              height: 780,
            },
            small: {
              width: 284,
              height: 402,
            },
            medium: {
              width: 390,
              height: 554,
            },
          },
        },
        tiny: 'https://media.kitsu.io/anime/poster_images/1376/tiny.jpg',
        large: 'https://media.kitsu.io/anime/poster_images/1376/large.jpg',
        small: 'https://media.kitsu.io/anime/poster_images/1376/small.jpg',
        medium: 'https://media.kitsu.io/anime/poster_images/1376/medium.jpg',
        original: 'https://media.kitsu.io/anime/poster_images/1376/original.png',
      },
      review: null,
    },
    {
      kitsu_id: '10740',
      title: 'One Punch Man',
      synopsis:
        "The seemingly ordinary and unimpressive Saitama has a rather unique hobby: being a hero. In order to pursue his childhood dream, he trained relentlessly for three years—and lost all of his hair in the process. Now, Saitama is incredibly powerful, so much so that no enemy is able to defeat him in battle. In fact, all it takes to defeat evildoers with just one punch has led to an unexpected problem—he is no longer able to enjoy the thrill of battling and has become quite bored.\n\nThis all changes with the arrival of Genos, a 19-year-old cyborg, who wishes to be Saitama's disciple after seeing what he is capable of. Genos proposes that the two join the Hero Association in order to become certified heroes that will be recognized for their positive contributions to society, and Saitama, shocked that no one knows who he is, quickly agrees. And thus begins the story of One Punch Man, an action-comedy that follows an eccentric individual who longs to fight strong enemies that can hopefully give him the excitement he once felt and just maybe, he'll become popular in the process.\n\n(Source: MAL Rewrite)",
      created_at: '2024-05-16T22:05:23.303426+00:00',
      poster_image: {
        meta: {
          dimensions: {
            tiny: {
              width: 110,
              height: 156,
            },
            large: {
              width: 550,
              height: 780,
            },
            small: {
              width: 284,
              height: 402,
            },
            medium: {
              width: 390,
              height: 554,
            },
          },
        },
        tiny: 'https://media.kitsu.io/anime/poster_images/10740/tiny.jpg',
        large: 'https://media.kitsu.io/anime/poster_images/10740/large.jpg',
        small: 'https://media.kitsu.io/anime/poster_images/10740/small.jpg',
        medium: 'https://media.kitsu.io/anime/poster_images/10740/medium.jpg',
        original: 'https://media.kitsu.io/anime/poster_images/10740/original.jpg',
      },
      review: null,
    },
    {
      kitsu_id: '482',
      title: 'My Neighbor Totoro',
      synopsis:
        'Follow the adventures of Satsuki and her four-year-old sister Mei when they move into a new home in the countryside. To their delight they discover that their new neighbor is a mysterious forest spirit called Totoro who can be seen only through the eyes of a child. Totoro introduces them to extraordinary characters, including a cat that doubles as a bus, takes them on a journey through the wonders of nature.\n\n(Source: Disney)',
      created_at: '2024-05-19T03:10:46.742066+00:00',
      poster_image: {
        meta: {
          dimensions: {
            tiny: {
              width: 110,
              height: 156,
            },
            large: {
              width: 550,
              height: 780,
            },
            small: {
              width: 284,
              height: 402,
            },
            medium: {
              width: 390,
              height: 554,
            },
          },
        },
        tiny: 'https://media.kitsu.io/anime/poster_images/482/tiny.jpg',
        large: 'https://media.kitsu.io/anime/poster_images/482/large.jpg',
        small: 'https://media.kitsu.io/anime/poster_images/482/small.jpg',
        medium: 'https://media.kitsu.io/anime/poster_images/482/medium.jpg',
        original: 'https://media.kitsu.io/anime/poster_images/482/original.jpg',
      },
      review: null,
    },
  ],
  ok: true,
  status: 200,
  meta: {
    total: 8,
    limit: 5,
    self: 1,
    next: 2,
  },
} satisfies GetWatchlistAnimeResponse

export const GET_ANIME_BY_WATCHLIST_MOCK = [
  {
    kitsu_id: '12',
    title: 'One Piece',
    synopsis:
      'Gol D. Roger was known as the "Pirate King," the strongest and most infamous being to have sailed the Grand Line. The capture and death of Roger by the World Government brought a change throughout the world. His last words before his death revealed the existence of the greatest treasure in the world, One Piece. It was this revelation that brought about the Grand Age of Pirates, men who dreamed of finding One Piece—which promises an unlimited amount of riches and fame—and quite possibly the pinnacle of glory and the title of the Pirate King.\nEnter Monkey D. Luffy, a 17-year-old boy who defies your standard definition of a pirate. Rather than the popular persona of a wicked, hardened, toothless pirate ransacking villages for fun, Luffy’s reason for being a pirate is one of pure wonder: the thought of an exciting adventure that leads him to intriguing people and ultimately, the promised treasure. Following in the footsteps of his childhood hero, Luffy and his crew travel across the Grand Line, experiencing crazy adventures, unveiling dark mysteries and battling strong enemies, all in order to reach the most coveted of all fortunes—One Piece.\n[Written by MAL Rewrite]',
    created_at: '2024-05-09T18:18:51.379367+00:00',
    poster_image: {
      meta: {
        dimensions: {
          tiny: {
            width: 110,
            height: 156,
          },
          large: {
            width: 550,
            height: 780,
          },
          small: {
            width: 284,
            height: 402,
          },
          medium: {
            width: 390,
            height: 554,
          },
        },
      },
      tiny: 'https://media.kitsu.io/anime/poster_images/12/tiny.jpg',
      large: 'https://media.kitsu.io/anime/poster_images/12/large.jpg',
      small: 'https://media.kitsu.io/anime/poster_images/12/small.jpg',
      medium: 'https://media.kitsu.io/anime/poster_images/12/medium.jpg',
      original: 'https://media.kitsu.io/anime/poster_images/12/original.png',
    },
    review: null,
  },
  {
    kitsu_id: '42196',
    title: 'Tensei shitara Slime Datta Ken 2',
    synopsis:
      'The second season of Tensei shitara Slime Datta Ken.\n\nA country built by our main character Rimuru and the many monsters who look up to him – the Jura Tempest Federation –, through agreements and trade with neighbouring countries, is the ideal “country where humans and monsters can walk alongside."\n\nRimuru has a tendency to “feel kindly towards humans”, because of its former nature as a human being ...\n\nHowever, there is a clear "hostility toward demons" that exists in this world.\nWhen faced with that unreasonable reality, Rimuru makes its choice.\n\n"Is there something that you don\'t want to lose?"\n\n(Source: Muse Asia)',
    created_at: '2024-05-16T01:18:20.068562+00:00',
    poster_image: {
      meta: {
        dimensions: {
          tiny: {
            width: 110,
            height: 156,
          },
          large: {
            width: 550,
            height: 780,
          },
          small: {
            width: 284,
            height: 402,
          },
          medium: {
            width: 390,
            height: 554,
          },
        },
      },
      tiny: 'https://media.kitsu.io/anime/poster_images/42196/tiny.jpg',
      large: 'https://media.kitsu.io/anime/poster_images/42196/large.jpg',
      small: 'https://media.kitsu.io/anime/poster_images/42196/small.jpg',
      medium: 'https://media.kitsu.io/anime/poster_images/42196/medium.jpg',
      original: 'https://media.kitsu.io/anime/poster_images/42196/original.jpg',
    },
    review: {
      rating: 10,
      status: 'completed',
      updated_at: '2024-05-18T19:28:58.330163+00:00',
    },
  },
] satisfies AnimeByWatchlist[]
