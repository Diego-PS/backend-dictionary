import { NextFunction, Response } from 'express'
import { AuthenticatedRequest } from './types'
import { JsonWebToken } from 'utils'

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authToken = req.headers.authorization
  if (!authToken) throw new Error('No authorization token providen')
  const [, token] = authToken.split(' ')
  try {
    const jwt = new JsonWebToken()
    const id = jwt.verify(token)
    req.id = id
    next()
  } catch {
    throw new Error('Invalid authorization token')
  }
}
