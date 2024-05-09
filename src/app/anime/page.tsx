import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { fetchWithType, withBaseURL } from '@/lib/api'

import type { User } from '@/api/users/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AnimePage() {
  const { data: user } = await fetchWithType<User>(withBaseURL('/api/users'), {
    method: 'GET',
    credentials: 'include',
    headers: new Headers(headers()),
  })

  if (!user?.id) {
    return redirect('/login')
  }

  const welcomeText = user.username ? `Welcome, ${user.username}` : 'Welcome'

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-6">
      <h1>Account</h1>
      <h2>{welcomeText}</h2>
      <form action="/auth/signout" method="POST">
        <button
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
          type="submit"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
