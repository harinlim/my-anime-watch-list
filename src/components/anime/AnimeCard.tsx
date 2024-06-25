import { Card, Group, Image, Text, Title } from '@mantine/core'
import clsx from 'clsx'

import styles from './AnimeCard.module.css'

type Props = {
  title?: string
  poster?: string
  rating?: string
}

// TODO: Expand styles and various states (hover, focus, active, etc.)
export function AnimeCard({ title, poster, rating }: Props) {
  return (
    <Card
      className={clsx(styles.card, 'h-auto min-w-10 shrink basis-1/2 lg:basis-auto')}
      maw={220}
      mih={300}
    >
      <Image src={poster} radius="md" width="w-full" alt={title} />
      <Group className="min-w-100 min-h-70 custom pt-5">
        <div>
          <Text className={styles.category} size="xs">
            Rating: {rating}
          </Text>
          <Title order={3} className={styles.title}>
            {title}
          </Title>
        </div>
      </Group>
    </Card>
  )
}
