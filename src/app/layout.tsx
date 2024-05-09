import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { clsx } from 'clsx'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'

import { Header } from '@/components/common/Header'
import { fetchWithType, withBaseURL } from '@/lib/api'

import { theme } from './theme'

import '@mantine/core/styles.css'
import './globals.css'

import type { User } from './api/users/types'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const { data: user } = await fetchWithType<User>(withBaseURL('/api/users'), {
    method: 'GET',
    credentials: 'include',
    headers: headers(),
  })

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={clsx(inter.className, 'bg-background text-foreground')}>
        <MantineProvider defaultColorScheme="dark" theme={theme}>
          <Header user={user} />
          <main className="min-h-screen min-w-80">{children}</main>
        </MantineProvider>
      </body>
    </html>
  )
}
