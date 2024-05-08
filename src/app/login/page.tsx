import { login, signup } from './actions'
import { SubmitButton } from './submit-button'

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  console.log(searchParams)
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
        <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
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

          <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
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

          <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
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
              className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
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
      </div>
    </main>
  )
}
