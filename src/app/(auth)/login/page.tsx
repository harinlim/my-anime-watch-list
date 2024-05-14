import { Paper, Title } from '@mantine/core'

import { login, signup } from './actions'
import styles from './login.module.css'
import { SubmitButton } from './submit-button'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  return (
    <div className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center">
      <Paper
        radius="md"
        p="xl"
        withBorder
        className="animate-in flex w-full max-w-md flex-col gap-2 px-8 shadow-lg dark:shadow-blue-500/40 sm:max-w-sm"
      >
        <Title order={1} className={`text-center ${styles.title}`} ta="center">
          Sign In
        </Title>
        <form
          id="login-form"
          className="text-foreground flex w-full flex-1 flex-col justify-center gap-2"
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
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
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
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
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
            className="mb-6 rounded-md border bg-inherit px-4 py-2"
          />

          <div className="mt-6 grid grid-cols-2 gap-4">
            <SubmitButton
              formAction={login}
              className="text-foreground mb-2 rounded-md bg-sky-500 px-4 py-2 text-white"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>
            <SubmitButton
              formAction={signup}
              className="border-foreground/20 text-foreground mb-2 rounded-md border px-4 py-2"
              pendingText="Signing Up..."
            >
              Sign Up
            </SubmitButton>
          </div>

          {searchParams.message && (
            <p className="bg-foreground/10 text-foreground mt-4 p-4 text-center text-red-500">
              {searchParams.message}
            </p>
          )}
        </form>
      </Paper>
    </div>
  )
}
