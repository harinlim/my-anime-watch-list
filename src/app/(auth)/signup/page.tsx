import { Paper, Title, Container, Box, Stack } from '@mantine/core'

import { SignupForm } from './SignupForm'

export default function Login() {
  return (
    <Stack className="min-h-[calc(100dvh-200px)] justify-center">
      <Box>
        <Container className="my-10 max-w-md">
          <Title className="text-center font-['Greycliff_CF',_var(--mantine-font-family)] font-black">
            Create an account
          </Title>

          <Paper className="mt-7 rounded-md border border-neutral-200 p-7 shadow-md dark:border-neutral-700">
            <SignupForm />
          </Paper>
        </Container>
      </Box>
    </Stack>
  )
}
