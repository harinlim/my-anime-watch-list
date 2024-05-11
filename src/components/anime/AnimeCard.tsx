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
      className={clsx(styles.card, 'basis-1/2 min-w-10 lg:basis-auto shrink h-auto')}
      maw={250}
      mih={300}
    >
      {/* <AspectRatio ratio={720 / 1080} maw={300} mx="auto">
        <Image src={poster} alt="Panda" />
      </AspectRatio> */}
      <Image src={poster} radius="md" width="w-full" />
      <Group className="pt-5 min-w-100 min-h-70 custom">
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
