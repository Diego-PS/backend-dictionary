import { Metadata } from 'entities'

export interface CacheInterface {
  set<KeyType, ValueType>(key: KeyType, value: ValueType): Promise<void>
  // saves a value into cashe with a corresopnding key

  get<KeyType, ValueType>(key: KeyType): Promise<ValueType | null>
  // retrieves a value from cashe given a key or returns null

  execute<KeyType, ValueType>(key: KeyType, promise: Promise<ValueType>): Promise<{ value: ValueType, metadata: Metadata }>
  // executes cache verification and storing
}
