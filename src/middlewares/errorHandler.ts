import { NextFunction, Request, Response } from 'express'

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err instanceof Error ? err.message : 'Unknown error'
  res.status(400).send({
    message,
  })
  next()
}
