import { Container, Flex, Button, Text, Group } from '@mantine/core'
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

        <Group>
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

          <Button
            size="lg"
            radius="md"
            color="red"
            className="w-fit"
            onClick={closeAddCollaboratorContent}
          >
            <Text>Cancel</Text>
          </Button>
        </Group>
      </Flex>
    </Container>
  )
}
