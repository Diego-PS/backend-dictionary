import { CacheInterface } from 'interfaces'
import { createClient } from 'redis'

export class Cache implements CacheInterface {
  static client = createClient()

  static async connect() {
    await Cache.client.connect()
  }

  async set<KeyType, ValueType>(key: KeyType, value: ValueType): Promise<void> {
    const keyStr = JSON.stringify(key)
    const valueStr = JSON.stringify(value)
    await Cache.client.set(keyStr, valueStr)
  }

  async get<KeyType, ValueType>(key: KeyType): Promise<ValueType | null> {
    const keyStr = JSON.stringify(key)
    const valueStr = await Cache.client.get(keyStr)
    if (valueStr === null) return null
    const value: ValueType = JSON.parse(valueStr)
    return value
  }
}
