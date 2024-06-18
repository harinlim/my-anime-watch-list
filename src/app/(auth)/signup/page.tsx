import { Paper, Title, Container, Box, Stack } from '@mantine/core'

import { SignupForm } from './SignupForm'

export default function Login() {
  return (
    <Stack className="min-h-[calc(100dvh-200px)] justify-center">
      <Box>
        <Container size={420} my={40}>
          <Title
            ta="center"
            className={`font-['Greycliff_CF',_var(--mantine-font-family)] font-black`}
          >
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
