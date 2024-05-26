import { Container, Flex, Button, Text } from '@mantine/core'
import { IconUserPlus } from '@tabler/icons-react'
import { QueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { UserSearchCombobox } from './UserSearchCombobox'

type AddCollaboratorsModalContentProps = {
  closeAddCollaboratorContent: () => void
}

export function AddCollaboratorsModalContent({
  closeAddCollaboratorContent,
}: AddCollaboratorsModalContentProps) {
  const [search, setSearch] = useState('')

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchIntervalInBackground: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  })

  return (
    <Container className="space-y-4">
      <Flex>
        <UserSearchCombobox />
      </Flex>
      <Flex direction="column" gap="md">
        <Flex>
          <Text size="md" className="mb-4">
            Add all users as:
          </Text>
        </Flex>

        <Button
          size="lg"
          radius="md"
          color="cyan"
          className="w-fit"
          onClick={closeAddCollaboratorContent}
        >
          <IconUserPlus size={20} />
          <Text>Add collaborator</Text>
        </Button>
      </Flex>
    </Container>
  )
}
