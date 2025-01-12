import { Request, Response } from 'express'

type MessageResponse = Response<{
  message: string
}>

export class MainRouteController {
  sendMessage(_: Request, res: MessageResponse) {
    const message = 'Fullstack Challenge 🏅 - Dictionary'
    res.status(200).send({ message })
  }
}
