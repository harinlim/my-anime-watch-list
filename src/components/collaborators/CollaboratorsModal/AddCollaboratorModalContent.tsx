import { Container, Flex, Button, Text } from '@mantine/core'
import { IconUserPlus } from '@tabler/icons-react'

import { UserSearchAutocomplete } from './UserSearchAutocomplete'

type AddCollaboratorsModalContentProps = {
  closeAddCollaboratorContent: () => void
}

export function AddCollaboratorsModalContent({
  closeAddCollaboratorContent,
}: AddCollaboratorsModalContentProps) {
  return (
    <Container className="space-y-4">
      <Flex>
        <UserSearchAutocomplete />
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
