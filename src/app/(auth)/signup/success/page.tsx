import { Title, Text, Button } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { fetchWithType, withBaseURL } from '@/lib/api'

import type { User } from '@/api/users/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SignupSuccessPage() {
  const { data: user } = await fetchWithType<User>(withBaseURL('/api/users'), {
    method: 'GET',
    credentials: 'include',
    headers: new Headers(headers()),
  })

  if (!user?.id) {
    return redirect('/login')
  }
  const welcomeText = user.username ? `Welcome, @${user.username} :)` : 'Welcome'

  return (
    <div className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center space-y-6 px-10">
      <Title order={1} className="sm:text-center">
        {welcomeText}
      </Title>
      <Text className="sm:text-center">
        You&apos;ve successfully created an account! Now you&apos;re ready to make your first
        watchlist.
      </Text>
      <a href="/profile">
        <Button
          variant="filled"
          color="teal"
          size="lg"
          radius="md"
          rightSection={<IconArrowRight size={14} />}
        >
          Go to your profile
        </Button>
      </a>
    </div>
  )
}
