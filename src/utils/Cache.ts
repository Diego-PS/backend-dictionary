import { Metadata } from 'entities'
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

  async execute<KeyType, ValueType, FuncParams>(key: KeyType, fn: (...args: FuncParams[]) => Promise<ValueType>, ...args: FuncParams[]): Promise<{ value: ValueType, metadata: Metadata }> {
    const start = new Date().getTime()
    const cached = await this.get<KeyType, ValueType>(key)
    const value = cached ?? await fn(...args)
    if (cached == null) await this.set(key, value)
    const end = new Date().getTime()
    const metadata: Metadata = {
      cache: cached === null ? 'MISS' : 'HIT',
      responseTime: end - start
    }
    return { value, metadata }
  }
}
