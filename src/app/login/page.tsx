import { Paper, Title } from '@mantine/core'

import { login, signup } from './actions'
import styles from './login.module.css'
import { SubmitButton } from './submit-button'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="min-h-[calc(100vh-150px)] flex flex-col justify-center items-center">
      <Paper
        radius="md"
        p="xl"
        withBorder
        className="flex flex-col px-8 w-full sm:max-w-sm max-w-md gap-2 shadow-lg dark:shadow-blue-500/40"
      >
        <Title order={1} className={`animate-in text-center ${styles.title}`} ta="center">
          Sign In
        </Title>
        <form
          id="login-form"
          className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        >
          <label htmlFor="email" className="block text-sm font-medium leading-6 ">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
          />

          <label htmlFor="username" className="block text-sm font-medium leading-6 ">
            Username:
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="your_username"
            required
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
          />

          <label htmlFor="password" className="block text-sm font-medium leading-6 ">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <SubmitButton
              formAction={login}
              className="bg-sky-500 text-white rounded-md px-4 py-2 text-foreground mb-2"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>
            <SubmitButton
              formAction={signup}
              className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2"
              pendingText="Signing Up..."
            >
              Sign Up
            </SubmitButton>
          </div>

          {searchParams.message && (
            <p className="text-red-500 mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </Paper>
    </div>
  )
}
