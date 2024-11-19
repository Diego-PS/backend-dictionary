import { JsonWebTokenInterface } from 'interfaces'
import jwt from 'jsonwebtoken'

export class JsonWebToken implements JsonWebTokenInterface {
  constructor(private key: string) {}

  generate(data: string): string {
    return jwt.sign(data, this.key, { expiresIn: '30m' })
    // Our JWTs will expire in 30 minutes
  }
  verify(token: string): string {
    const data = jwt.verify(token, this.key)
    if (typeof data !== 'string') {
      throw new Error('Invalid token')
    }
    return data
  }
}
