import { Anchor, Paper, Title, Text, Container, Box, Stack } from '@mantine/core'
import Link from 'next/link'

import { LoginForm } from './LoginForm'

export default function Login() {
  return (
    <Stack className="min-h-[calc(100dvh-200px)] justify-center">
      <Box>
        <Container className="my-10 max-w-md">
          <Title className="text-center font-['Greycliff_CF',_var(--mantine-font-family)] font-black">
            Welcome back!
          </Title>
          <Text className="mt-1.5 text-center text-sm">
            Don&apos;t have an account yet?{' '}
            <Anchor
              size="sm"
              component={Link}
              href="/signup"
              className="text-blue-600 underline dark:text-blue-400"
            >
              Create account
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <LoginForm />
          </Paper>
        </Container>
      </Box>
    </Stack>
  )
}
