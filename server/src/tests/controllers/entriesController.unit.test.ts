// Imports e configuração inicial

import { EntriesController } from '../../controllers'

import {
  GetEntries,
  ViewEntry,
  AddWordToFavorites,
  removeWordFromFavorites,
} from '../../usecases'

import { Response } from 'express'

import {
  CacheInterface,
  WordRepositoryInterface,
  UserRepositoryInterface,
} from 'interfaces'

import {
  userRepositoryMock,
  wordRepositoryMock,
  cacheMock,
  mockRequest,
  mockResponse,
} from '../testSetup'

describe('EntriesController', () => {
  const getEntriesUseCaseMock: Partial<GetEntries> = { execute: jest.fn() }
  const viewEntryUseCaseMock: Partial<ViewEntry> = { execute: jest.fn() }

  const entriesController = new EntriesController(
    getEntriesUseCaseMock as GetEntries,
    viewEntryUseCaseMock as ViewEntry,
    new AddWordToFavorites(
      userRepositoryMock as UserRepositoryInterface,
      wordRepositoryMock as WordRepositoryInterface
    ),
    new removeWordFromFavorites(
      userRepositoryMock as UserRepositoryInterface,
      wordRepositoryMock as WordRepositoryInterface
    ),
    cacheMock as CacheInterface
  )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deve obter entradas com sucesso', async () => {
    ;(cacheMock.execute as jest.Mock).mockResolvedValue({
      value: { entries: [] },
      metadata: { cache: 'HIT', responseTime: '10ms' },
    })

    const req = mockRequest({}, {}, { search: 'word', page: '1', limit: '10' })
    const res = mockResponse()

    await entriesController.getEntries(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ entries: [] })
  })

  it('deve lançar erro quando falhar ao obter entradas do cache', async () => {
    ;(cacheMock.execute as jest.Mock).mockRejectedValue(
      new Error('Cache fetch failed')
    )

    const req = mockRequest({}, {}, { search: 'word', page: '1', limit: '10' })
    const res = mockResponse()

    await expect(
      entriesController.getEntries(req as any, res as Response)
    ).rejects.toThrow('Cache fetch failed')
  })

  it('deve visualizar uma entrada com sucesso', async () => {
    ;(cacheMock.execute as jest.Mock).mockResolvedValue({
      value: { word: 'example' },
      metadata: { cache: 'HIT', responseTime: '5ms' },
    })

    const req = mockRequest({}, { word: 'example' })
    const res = mockResponse()

    await entriesController.viewEntry(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.set).toHaveBeenCalledWith({
      'x-cache': 'HIT',
      'x-response-time': '5ms',
    })
    expect(res.send).toHaveBeenCalledWith({ word: 'example' })
  })

  it('deve lançar erro ao visualizar uma entrada inexistente', async () => {
    ;(cacheMock.execute as jest.Mock).mockRejectedValue(
      new Error('Entry not found')
    )

    const req = mockRequest({}, { word: 'nonexistent' })
    const res = mockResponse()

    await expect(
      entriesController.viewEntry(req as any, res as Response)
    ).rejects.toThrow('Entry not found')
  })

  it('deve adicionar palavra aos favoritos com sucesso', async () => {
    ;(userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({
      word: 'favorite',
    })

    const req = mockRequest({}, { word: 'favorite' })
    const res = mockResponse()

    await entriesController.addWordToFavorites(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ word: 'favorite' })
  })

  it('deve remover palavra dos favoritos com sucesso', async () => {
    ;(userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(true)
    ;(userRepositoryMock.removeWordFromFavorites as jest.Mock).mockResolvedValue({
      word: 'favorite',
    })

    const req = mockRequest({}, { word: 'favorite' })
    const res = mockResponse()

    await entriesController.removeWordFromFavorites(req as any, res as Response)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith({ word: 'favorite' })
  })

  it('deve lançar erro ao tentar adicionar uma palavra inválida aos favoritos', async () => {
    ;(userRepositoryMock.addWordToFavorites as jest.Mock).mockRejectedValue(
      new Error('Invalid word')
    )

    const req = mockRequest({}, { word: 'invalid' })
    const res = mockResponse()

    await expect(
      entriesController.addWordToFavorites(req as any, res as Response)
    ).rejects.toThrow('word invalid is already in favorites')
  })

  it('deve lançar erro ao tentar remover uma palavra que não está nos favoritos', async () => {
    ;(userRepositoryMock.removeWordFromFavorites as jest.Mock).mockRejectedValue(
      new Error('The word nonexistent is not in favorites')
    )

    const req = mockRequest({}, { word: 'nonexistent' })
    const res = mockResponse()

    await expect(
      entriesController.removeWordFromFavorites(req as any, res as Response)
    ).rejects.toThrow('The word nonexistent is not in favorites')
  })

  it('deve lançar erro ao validar número negativo como argumento de consulta', async () => {
    const req = mockRequest({}, {}, { page: '-1', limit: '10' })
    const res = mockResponse()

    await expect(
      entriesController.getEntries(req as any, res as Response)
    ).rejects.toThrow('Invalid query argument(s)')
  })

  it('deve lançar erro ao validar argumento de consulta não numérico', async () => {
    const req = mockRequest({}, {}, { page: 'abc', limit: '10' })
    const res = mockResponse()

    await expect(
      entriesController.getEntries(req as any, res as Response)
    ).rejects.toThrow('Entry not found')
  })
})

