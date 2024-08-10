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

          <Paper withBorder shadow="md" p={30} mt={20} radius="md">
            <SignupForm />
          </Paper>
        </Container>
      </Box>
    </Stack>
  )
}
