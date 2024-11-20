export interface CacheInterface {
  set<KeyType, ValueType>(key: KeyType, value: ValueType): Promise<void>
  // saves a value into cashe with a corresopnding key

  get<KeyType, ValueType>(key: KeyType): Promise<ValueType | null>
  // retrieves a value from cashe given a key or returns null
}
