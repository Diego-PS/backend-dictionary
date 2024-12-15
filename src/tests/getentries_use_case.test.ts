import { GetEntries } from '../usecases'

import { SearchQuery } from 'entities'

import { WordRepositoryInterface } from 'interfaces'

describe('Caso de Uso: GetEntries', () => {
  let wordRepositoryMock: jest.Mocked<WordRepositoryInterface>
  let getEntries: GetEntries

  beforeEach(() => {
    // Mock do WordRepositoryInterface
    wordRepositoryMock = {
      register: jest.fn(),
      get: jest.fn(),
      getWord: jest.fn(),
    }
    getEntries = new GetEntries(wordRepositoryMock)
  })

  it('deve retornar os detalhes de paginação corretos e os resultados', async () => {
    const date0: Date = new Date()
    const date10: Date = new Date()
    const query: SearchQuery = { limit: 2, page: 1 }
    wordRepositoryMock.get.mockResolvedValue({
      words: [
        { word: 'hello0', added: date0 },
        { word: 'hello10', added: date10 },
      ],
      totalWords: 5,
    })

    const response = await getEntries.execute(query)

    expect(response).toEqual({
      results: ['hello0', 'hello10'],
      totalDocs: 5,
      page: 1,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    })

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query)
  })

  it('deve lidar com uma consulta sem paginação', async () => {
    const date1: Date = new Date()
    const date2: Date = new Date()
    const date3: Date = new Date()

    const query: SearchQuery = {}
    wordRepositoryMock.get.mockResolvedValue({
      words: [
        { word: 'hello1', added: date1 },
        { word: 'hello2', added: date2 },
        { word: 'hello3', added: date3 },
      ],
      totalWords: 3,
    })

    const response = await getEntries.execute(query)

    expect(response).toEqual({
      results: ['hello1', 'hello2', 'hello3'],
      totalDocs: 3,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    })

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query)
  })

  it('deve retornar nenhum resultado para uma consulta vazia', async () => {
    const query: SearchQuery = { limit: 5, page: 1 }
    wordRepositoryMock.get.mockResolvedValue({
      words: [],
      totalWords: 0,
    })

    const response = await getEntries.execute(query)

    expect(response).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    })

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query)
  })

  it('deve calcular corretamente os detalhes da paginação para várias páginas', async () => {
    const date4: Date = new Date()
    const date5: Date = new Date()
    const date6: Date = new Date()
    const query: SearchQuery = { limit: 3, page: 2 }
    wordRepositoryMock.get.mockResolvedValue({
      words: [
        { word: 'hello4', added: date4 },
        { word: 'hello5', added: date5 },
        { word: 'hello6', added: date6 },
      ],
      totalWords: 8,
    })

    const response = await getEntries.execute(query)

    expect(response).toEqual({
      results: ['hello4', 'hello5', 'hello6'],
      totalDocs: 8,
      page: 2,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    })

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query)
  })
})
