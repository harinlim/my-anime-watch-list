import { groupBy } from './group-by'

import type { Expect, Equal } from '@/types/utils'

describe('groupBy', () => {
  it('should group by role', () => {
    const collaborators = [
      { user_id: '1', role: 'owner' },
      { user_id: '2', role: 'editor' },
      { user_id: '3', role: 'viewer' },
      { user_id: '4', role: 'owner' },
      { user_id: '5', role: 'editor' },
      { user_id: '6', role: 'viewer' },
    ]
    const result = groupBy(collaborators, ({ role }) => role)

    expect(result).toEqual({
      owner: [
        { user_id: '1', role: 'owner' },
        { user_id: '4', role: 'owner' },
      ],
      editor: [
        { user_id: '2', role: 'editor' },
        { user_id: '5', role: 'editor' },
      ],
      viewer: [
        { user_id: '3', role: 'viewer' },
        { user_id: '6', role: 'viewer' },
      ],
    })
  })

  it('should infer the type of the key', () => {
    const collaborators = [
      { user_id: '1', role: 'owner' },
      { user_id: '2', role: 'editor' },
      { user_id: '3', role: 'viewer' },
    ] satisfies { role: 'owner' | 'editor' | 'viewer'; user_id: string }[]

    const result = groupBy(collaborators, ({ role }) => role)

    type _TestResultKeyIsInferred = Expect<
      Equal<keyof typeof result, 'owner' | 'editor' | 'viewer'>
    >
    // @ts-expect-error The key should not be a string
    type _TestResultKeyNotString = Expect<Equal<keyof typeof result, string>>
  })

  it('returns an empty object if the array is empty', () => {
    const collaborators = [] satisfies { role: 'owner' | 'editor' | 'viewer'; user_id: string }[]
    const result = groupBy(collaborators, ({ role }) => role)

    expect(result).toEqual({})
  })
})
