import { Response } from 'express'
import { CacheInterface } from 'interfaces'
import { AuthenticatedRequest } from 'middlewares'
import { GetUserProfile } from 'use-cases'

type UserProfile = {
  id: string
  name: string
  email: string
}

type GetUserProfileResponse = Response<UserProfile>

export class UserController {
  constructor(private getUserProfileUseCase: GetUserProfile, private cache: CacheInterface) {}

  getUserProfile = async (
    { id }: AuthenticatedRequest,
    res: GetUserProfileResponse
  ) => {
    const userProfilePromise = this.getUserProfileUseCase.execute(id!)
    const { value, metadata } = await this.cache.execute<string, UserProfile>(id!, userProfilePromise)
    res.status(200).set({
      'x-cache': metadata.cache,
      'x-response-time': metadata.responseTime
    }).send(value)
  }
}
