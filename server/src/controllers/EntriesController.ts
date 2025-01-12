import { Word } from 'entities'
import { Request, Response } from 'express'
import { CacheInterface } from 'interfaces'
import { AuthenticatedRequest } from 'middlewares'
import {
  AddWordToFavorites,
  EntriesReponseBody,
  GetEntries,
  removeWordFromFavorites,
  ViewEntry,
} from 'use-cases'

type GetEntriesRequest = Request<
  undefined,
  undefined,
  undefined,
  {
    search?: string
    page?: string
    limit?: string
  }
>

type WordRequest = AuthenticatedRequest<{ word: string }>

type WordResponse = Response<Word>

type GetEntriesResponse = Response<EntriesReponseBody>

export class EntriesController {
  constructor(
    private getEntriesUseCase: GetEntries,
    private viewEntryUseCase: ViewEntry,
    private addWordToFavoritesUseCase: AddWordToFavorites,
    private removeWordFromFavoritesUseCase: removeWordFromFavorites,
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

  getEntries = async (
    { query }: GetEntriesRequest,
    res: GetEntriesResponse
  ) => {
    const page =
      query.page !== undefined
        ? this.validatePositiveInteger(query.page)
        : undefined
    const limit =
      query.limit !== undefined
        ? this.validatePositiveInteger(query.limit)
        : undefined
    const search = query.search
    const searchQuery = { page, limit, search }
    const { value, metadata } = await this.cache.execute(
      searchQuery,
      this.getEntriesUseCase.execute,
      searchQuery
    )
    res
      .status(200)
      .set({
        'x-cache': metadata.cache,
        'x-response-time': metadata.responseTime,
      })
      .send(value)
  }

  viewEntry = async (
    { id, params: { word } }: WordRequest,
    res: WordResponse
  ) => {
    const { value, metadata } = await this.cache.execute(
      { method: 'viewEntry', id, word },
      this.viewEntryUseCase.execute,
      id!,
      word
    )
    res
      .status(200)
      .set({
        'x-cache': metadata.cache,
        'x-response-time': metadata.responseTime,
      })
      .send(value)
  }

  addWordToFavorites = async (
    { id, params: { word } }: WordRequest,
    res: WordResponse
  ) => {
    const wordInfo = await this.addWordToFavoritesUseCase.execute(id!, word)
    res.status(200).send(wordInfo)
  }

  removeWordFromFavorites = async (
    { id, params: { word } }: WordRequest,
    res: WordResponse
  ) => {
    const wordInfo = await this.removeWordFromFavoritesUseCase.execute(
      id!,
      word
    )
    res.status(200).send(wordInfo)
  }
}
