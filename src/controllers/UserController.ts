import { Request, Response } from 'express'
import { CacheInterface } from 'interfaces'
import { AuthenticatedRequest } from 'middlewares'
import { GetFavorites, GetHistory, GetUserProfile, WordsReponseBody } from 'use-cases'

type UserProfile = {
  id: string
  name: string
  email: string
}

type GetUserProfileResponse = Response<UserProfile>

type GetWordsRequest = AuthenticatedRequest<{}, {}, {}, {
  page?: string
  limit?: string
}>

type GetWordsResponse = Response<WordsReponseBody>

export class UserController {
  constructor(
    private getUserProfileUseCase: GetUserProfile,
    private getHistoryUseCase: GetHistory,
    private getFavoritesUseCase: GetFavorites,
    private cache: CacheInterface
  ) {}

  private validatePositiveInteger(numeral: string): number {
    try {
      const num = parseInt(numeral)
      if (num <= 0) throw new Error()
      return num
    } catch {
      throw new Error('Invalid query argument(s)')
    }
  }

  getUserProfile = async (
    { id }: AuthenticatedRequest,
    res: GetUserProfileResponse
  ) => {
    const { value, metadata } = await this.cache.execute(id!, this.getUserProfileUseCase.execute, id!)
    res.status(200).set({
      'x-cache': metadata.cache,
      'x-response-time': metadata.responseTime
    }).send(value)
  }

  getHistory = async (
    { id, query }: GetWordsRequest,
    res: GetWordsResponse
  ) => {
    const page = query.page !== undefined ? this.validatePositiveInteger(query.page) : undefined
    const limit = query.limit !== undefined ? this.validatePositiveInteger(query.limit) : undefined
    const result = await this.getHistoryUseCase.execute(id!, { page, limit })
    res.status(200).send(result)
  }

  getFavorites = async (
    { id, query }: GetWordsRequest,
    res: GetWordsResponse
  ) => {
    const page = query.page !== undefined ? this.validatePositiveInteger(query.page) : undefined
    const limit = query.limit !== undefined ? this.validatePositiveInteger(query.limit) : undefined
    const result = await this.getFavoritesUseCase.execute(id!, { page, limit })
    res.status(200).send(result)
  }
}
