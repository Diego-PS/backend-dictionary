/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from 'express'

export interface AuthenticatedRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  id?: string
}
