import { Anchor, Paper, Title, Text, Container, Box, Stack } from '@mantine/core'
import Link from 'next/link'

import { LoginForm } from './LoginForm'

export default function Login() {
  return (
    <Stack className="min-h-[calc(100dvh-200px)] justify-center">
      <Box>
        <Container size={420} my={40}>
          <Title
            ta="center"
            className={`font-['Greycliff_CF',_var(--mantine-font-family)] font-black`}
          >
            Welcome back!
          </Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            Don&apos;t have an account yet?{' '}
            <Anchor size="sm" component={Link} href="/signup">
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
