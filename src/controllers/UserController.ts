import { Response } from 'express'
import { AuthenticatedRequest } from 'middlewares'
import { GetUserProfile } from 'use-cases'

type GetUserProfileResponse = Response<{
  id: string
  name: string
  email: string
}>

export class UserController {
  constructor(private getUserProfileUseCase: GetUserProfile) {}

  getUserProfile = async (
    { id }: AuthenticatedRequest,
    res: GetUserProfileResponse
  ) => {
    const profile = await this.getUserProfileUseCase.execute(id!)
    res.status(200).send(profile)
  }
}
