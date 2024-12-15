import { GetHistory } from '../usecases';
import { UserRepositoryInterface } from 'interfaces';
import { Word, PaginationQuery } from 'entities';

describe('Caso de Uso: GetHistory', () => {
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
  let getHistory: GetHistory;

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
    };

    getHistory = new GetHistory(userRepositoryMock);
  });

  it('deve retornar o histórico paginado com cálculos corretos', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
    ];

    userRepositoryMock.getHistory.mockResolvedValue({
      words: mockWords,
      totalWords: 5,
    });

    const pagination: PaginationQuery = { page: 1, limit: 2 };
    const result = await getHistory.execute('1', pagination);

    expect(result).toEqual({
      results: mockWords,
      totalDocs: 5,
      page: 1,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    });

    expect(userRepositoryMock.getHistory).toHaveBeenCalledWith('1', pagination);
  });

  it('deve lidar com resultados vazios do histórico', async () => {
    userRepositoryMock.getHistory.mockResolvedValue({
      words: [],
      totalWords: 0,
    });

    const pagination: PaginationQuery = { page: 1, limit: 2 };
    const result = await getHistory.execute('1', pagination);

    expect(result).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });

    expect(userRepositoryMock.getHistory).toHaveBeenCalledWith('1', pagination);
  });

  it('deve lidar com paginação quando o limite não for definido', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
    ];

    userRepositoryMock.getHistory.mockResolvedValue({
      words: mockWords,
      totalWords: 2,
    });

    const pagination: PaginationQuery = { page: 1 };
    const result = await getHistory.execute('1', pagination);

    expect(result).toEqual({
      results: mockWords,
      totalDocs: 2,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

    expect(userRepositoryMock.getHistory).toHaveBeenCalledWith('1', pagination);
  });

  it('deve calcular corretamente hasNext e hasPrev para histórico com múltiplas páginas', async () => {
    const mockWords: Word[] = [
      { word: 'word3', added: new Date() },
      { word: 'word4', added: new Date() },
    ];

    userRepositoryMock.getHistory.mockResolvedValue({
      words: mockWords,
      totalWords: 6,
    });

    const pagination: PaginationQuery = { page: 2, limit: 2 };
    const result = await getHistory.execute('1', pagination);

    expect(result).toEqual({
      results: mockWords,
      totalDocs: 6,
      page: 2,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    });

    expect(userRepositoryMock.getHistory).toHaveBeenCalledWith('1', pagination);
  });
});
