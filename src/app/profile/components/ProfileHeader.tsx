import { Text, Title } from '@mantine/core'
import clsx from 'clsx'

import { Avatar } from '@/components/watchlists/AvatarGroup'

import type { PublicUser } from '@/types/users'

type Props = {
  user: PublicUser
  className?: string
}

export function ProfileHeader({ user, className }: Props) {
  return (
    <div className={clsx('flex flex-col items-center', className)}>
      <Avatar user={user} className="size-24 border-2 border-indigo-300 sm:size-32" />
      <Title order={1} className="pt-8 text-4xl lg:text-5xl">
        <Text inherit component="span" c="indigo">
          @{user.username}
        </Text>
        &apos;s Profile
      </Title>
    </div>
  )
}
