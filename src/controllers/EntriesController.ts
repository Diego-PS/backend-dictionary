import { Word } from 'entities'
import { Request, Response } from 'express'
import { CacheInterface } from 'interfaces'
import { AuthenticatedRequest } from 'middlewares'
import { EntriesReponseBody, GetEntries, ViewEntry } from 'use-cases'

type GetEntriesRequest = Request<{}, {}, {}, {
  search?: string
  page?: string
  limit?: string
}>

type ViewEntryRequest = AuthenticatedRequest<{ word: string }>

type ViewEntryResponse = Response<Word>

type GetEntriesResponse = Response<EntriesReponseBody>

export class EntriesController {
  constructor(private getEntriesUseCase: GetEntries, private viewEntryUseCase: ViewEntry,  private cache: CacheInterface) {}

  private validatePositiveInteger(numeral: string): number {
    try {
      const num = parseInt(numeral)
      if (num <= 0) throw new Error()
      return num
    } catch {
      throw new Error('Invalid query argument(s)')
    }
  }

  getEntries = async({ query }: GetEntriesRequest, res: GetEntriesResponse) => {
    const page = query.page !== undefined ? this.validatePositiveInteger(query.page): undefined
    const limit = query.limit !== undefined ? this.validatePositiveInteger(query.limit): undefined
    const search = query.search
    const searchQuery = { page, limit, search }
    const getEntriesPromise = this.getEntriesUseCase.execute(searchQuery)
    const { value, metadata } = await this.cache.execute(searchQuery, getEntriesPromise)
    res.status(200).set({
      'x-cache': metadata.cache,
      'x-response-time': metadata.responseTime
    }).send(value)
  }

  viewEntry = async({ id, params: { word } }: ViewEntryRequest, res: ViewEntryResponse) => {
    const viewEntryPromise = this.viewEntryUseCase.execute(id!, word)
    const { value, metadata } = await this.cache.execute({ id, word }, viewEntryPromise)
    res.status(200).set({
      'x-cache': metadata.cache,
      'x-response-time': metadata.responseTime
    }).send(value)
  }
}
