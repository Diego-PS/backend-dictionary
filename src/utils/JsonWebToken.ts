import { JsonWebTokenInterface } from 'interfaces'
import jwt from 'jsonwebtoken'

export class JsonWebToken implements JsonWebTokenInterface {
  constructor(private key: string) {}

  generate(data: string): string {
    return jwt.sign({ data: data }, this.key, { expiresIn: '30m' })
    // Our JWTs will expire in 30 minutes
  }
  verify(token: string): string {
    try {
      const { data } = jwt.verify(token, this.key) as { data: string }
      return data
    } catch {
      throw new Error('Invalid token')
    }
  }
}
