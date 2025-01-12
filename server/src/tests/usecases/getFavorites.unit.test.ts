import { GetFavorites, WordsReponseBody } from '../../usecases'

import { Word, PaginationQuery } from 'entities'

import { UserRepositoryInterface } from 'interfaces'

describe('Caso de Uso: GetFavorites', () => {
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>
  let getFavorites: GetFavorites

  beforeEach(() => {
    // Mock do UserRepositoryInterface
    userRepositoryMock = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      checkIfUserHasWordInHistory: jest.fn(),
      registerWordToHistory: jest.fn(),
      checkIfWordIsInFavorites: jest.fn(),
      addWordToFavorites: jest.fn(),
      removeWordFromFavorites: jest.fn(),
      getHistory: jest.fn(),
      getFavorites: jest.fn(),
      create: jest.fn(),
    }
    getFavorites = new GetFavorites(userRepositoryMock)
  })

  it('deve retornar as palavras favoritas do usuário com paginação quando existirem favoritos', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
    ]

    userRepositoryMock.getFavorites.mockResolvedValue({
      words: mockWords,
      totalWords: mockWords.length,
    })

    const pagination: PaginationQuery = { page: 1, limit: 10 }
    const response = await getFavorites.execute('1', pagination)

    expect(response).toEqual<WordsReponseBody>({
      results: mockWords,
      totalDocs: mockWords.length,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    })

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith(
      '1',
      pagination
    )
  })

  it('deve retornar uma lista de favoritos vazia quando não houver favoritos', async () => {
    userRepositoryMock.getFavorites.mockResolvedValue({
      words: [],
      totalWords: 0,
    })

    const pagination: PaginationQuery = { page: 1, limit: 10 }
    const response = await getFavorites.execute('1', pagination)

    expect(response).toEqual<WordsReponseBody>({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    })

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith(
      '1',
      pagination
    )
  })

  it('deve lidar com paginação quando há uma página anterior (hasPrev)', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
      { word: 'word3', added: new Date() },
      { word: 'word4', added: new Date() },
    ]

    userRepositoryMock.getFavorites.mockResolvedValue({
      words: mockWords.slice(2), // mock segunda página
      totalWords: mockWords.length,
    })

    const pagination: PaginationQuery = { page: 2, limit: 2 }
    const response = await getFavorites.execute('1', pagination)

    expect(response).toEqual<WordsReponseBody>({
      results: mockWords.slice(2),
      totalDocs: mockWords.length,
      page: 2,
      totalPages: 2,
      hasNext: false,
      hasPrev: true,
    })

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith(
      '1',
      pagination
    )
  })

  it('deve lidar com o caso onde o limite não foi especificado na paginação', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
    ]

    userRepositoryMock.getFavorites.mockResolvedValue({
      words: mockWords,
      totalWords: mockWords.length,
    })

    const pagination: PaginationQuery = { page: 1 } // sem limite especificado
    const response = await getFavorites.execute('1', pagination)

    expect(response).toEqual<WordsReponseBody>({
      results: mockWords,
      totalDocs: mockWords.length,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    })

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith(
      '1',
      pagination
    )
  })
})
