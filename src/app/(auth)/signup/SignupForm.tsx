'use client'

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Group,
  Button,
  Alert,
  Anchor,
  Box,
  Text,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { signup } from '../actions'
import { signupSchema } from '../schemas'

export function SignupForm() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      username: '',
      password: '',
      terms: false,
    },
    validate: zodResolver(signupSchema),
    clearInputErrorOnChange: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = form.onSubmit(async values => {
    setIsSubmitting(true)
    const result = await signup(values)

    setIsSubmitting(false)

    if (result.success) {
      setError('')

      router.push('/signup/success')
      setIsSubmitting(false)
      return
    }

    if (result.fieldErrors) {
      setError('')
      form.setErrors({
        email: result.fieldErrors.email?.join('. '),
        username: result.fieldErrors.username?.join('. '),
        password: result.fieldErrors.password?.join('. '),
      })
      return
    }

    if (result.error) {
      setError(result.error)
      return
    }

    setError('Failed to sign up. Please try again later.')
    console.error(result)
  })

  const [isDisabled, setIsDisabled] = useState(!form.getValues().terms)
  form.watch('terms', field => setIsDisabled(!field.value))

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert
          variant="light"
          color="red"
          mb="lg"
          title={error}
          withCloseButton
          closeButtonLabel="Dismiss error"
          onClose={() => setError('')}
          icon={<IconAlertCircle />}
        />
      )}
      <TextInput
        label="Email"
        withAsterisk
        placeholder="Email@example.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <TextInput
        label="Username"
        withAsterisk
        placeholder="Username"
        mt="md"
        key={form.key('username')}
        {...form.getInputProps('username')}
      />
      <PasswordInput
        label="Password"
        withAsterisk
        placeholder="Your password"
        mt="md"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      <Group justify="space-between" mt="lg">
        <Checkbox
          label="I accept terms and conditions"
          key={form.key('terms')}
          required
          {...form.getInputProps('terms')}
        />
      </Group>
      <Button
        type="submit"
        fullWidth
        mt="lg"
        mb="sm"
        size="md"
        // Completely disable button on submit, but allow focus otherwise
        disabled={isSubmitting}
        aria-disabled={isDisabled}
        data-disabled={isDisabled}
      >
        <Text size="sm" fw={500}>
          Sign up
        </Text>
      </Button>

      <Box ta="right" pr="sm">
        <Anchor component={Link} href="/login" c="dimmed" size="xs">
          Already have an account? Login
        </Anchor>
      </Box>
    </form>
  )
}
