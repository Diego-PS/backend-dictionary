import { JsonWebTokenInterface } from 'interfaces'
import jwt from 'jsonwebtoken'

export class JsonWebToken implements JsonWebTokenInterface {
  private static key: string = ''
  public static setKey(key: string) {
    if (JsonWebToken.key !== '') {
      throw new Error('JWT secret key already set')
    }
    if (key === '') {
      throw new Error('JWT secret key cannot be empty')
    }
    JsonWebToken.key = key
  }

  generate(data: string): string {
    return jwt.sign({ data: data }, JsonWebToken.key, { expiresIn: '30m' })
    // Our JWTs will expire in 30 minutes
  }
  verify(token: string): string {
    try {
      const { data } = jwt.verify(token, JsonWebToken.key) as { data: string }
      return data
    } catch {
      throw new Error('Invalid token')
    }
  }
}
