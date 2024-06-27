import { Text, Title } from '@mantine/core'

import { Avatar } from '../watchlists/AvatarGroup'

import type { PublicUser, User } from '@/types/users'

type Props = {
  user: User | PublicUser
  children?: React.ReactNode
}

export function ProfileContent({ user, children }: Props) {
  return (
    <>
      <div className="flex flex-col items-center">
        <Avatar user={user} className="size-24 border-2 border-indigo-300 sm:size-32" />
        <Title order={1} className="pt-8 text-4xl lg:text-5xl">
          <Text inherit component="span" c="indigo">
            @{user.username}
          </Text>
          &apos;s Profile
        </Title>
      </div>
      <section>{children}</section>
    </>
  )
}
