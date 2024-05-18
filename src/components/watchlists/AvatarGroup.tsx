import { Tooltip } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import styles from './AvatarGroup.module.css'

import type { WatchlistOverview } from '@/types/watchlists'

type WatchlistUsers = WatchlistOverview['watchlists_users']

type AvatarGroupProps = {
  watchlist_users: WatchlistUsers
}

export function AvatarGroup({ watchlist_users }: AvatarGroupProps) {
  const watchlistUsersOverview = watchlist_users.slice(0, 4)
  const remainingUsers = watchlist_users.length - watchlistUsersOverview.length

  return (
    <div className="flex -space-x-2">
      {watchlistUsersOverview.map(user => (
        <Tooltip key={user.user_id} label={`@${user.username}`} position="top">
          <Link href={`/profile/${user.username}`}>
            {user.avatar_url ? (
              <Image
                key={user.user_id}
                className={clsx(styles.ring, 'inline-block')}
                src={
                  user.avatar_url ??
                  'https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'
                }
                alt={`${user.username} avatar`}
              />
            ) : (
              <svg
                key={user.user_id}
                className={clsx(
                  styles.ring,
                  'inline-block bg-zinc-300 text-gray-400 dark:bg-zinc-500'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label={`${user.username} avatar`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </Link>
        </Tooltip>
      ))}
      {remainingUsers > 0 && (
        <span
          className={clsx(
            styles.ring,
            'inline-flex items-center justify-center bg-gray-100 dark:bg-neutral-600'
          )}
        >
          <span className="font-medium leading-none text-gray-500 dark:text-neutral-400">
            {remainingUsers}+
          </span>
        </span>
      )}
    </div>
  )
}
