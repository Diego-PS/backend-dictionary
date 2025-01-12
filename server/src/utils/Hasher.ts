import { HasherInterface } from 'interfaces'
import bcrypt from 'bcrypt'

export class Hasher implements HasherInterface {
  async hash(message: string): Promise<string> {
    const hashed = await bcrypt.hash(message, 10)
    return hashed
  }

  async compare(message: string, hashed: string): Promise<boolean> {
    const result = await bcrypt.compare(message, hashed)
    return result
  }
}
