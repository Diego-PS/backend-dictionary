import { ViewEntry } from '../usecases';

import { Word } from 'entities'; 

import { WordRepositoryInterface, UserRepositoryInterface } from 'interfaces';

describe('Caso de Uso: Visualizar Entrada (ViewEntry)', () => {
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>;
  let mockWordRepository: jest.Mocked<WordRepositoryInterface>;
  let viewEntry: ViewEntry;

  beforeEach(() => {
    // Mock do UserRepositoryInterface
    mockUserRepository = {
      checkIfUserHasWordInHistory: jest.fn(),
      registerWordToHistory: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryInterface>;

    // Mock do WordRepositoryInterface
    mockWordRepository = {
      getWord: jest.fn(),
    } as unknown as jest.Mocked<WordRepositoryInterface>;

    viewEntry = new ViewEntry(mockUserRepository, mockWordRepository);
  });

  it('deve retornar a palavra se o usuário já tiver ela no histórico', async () => {
    const date: Date = new Date();
    const mockWord: Word = { word: 'test', added: date };
    mockUserRepository.checkIfUserHasWordInHistory.mockResolvedValue(true);
    mockWordRepository.getWord.mockResolvedValue(mockWord);

    const result = await viewEntry.execute('user-id', 'test');

    expect(mockUserRepository.checkIfUserHasWordInHistory).toHaveBeenCalledWith('user-id', 'test');
    expect(mockWordRepository.getWord).toHaveBeenCalledWith('test');
    expect(result).toEqual(mockWord);
  });

  it('deve registrar uma palavra no histórico e retornar a informação da palavra se o usuário não tiver ela no histórico', async () => {
    const date: Date = new Date();
    const mockWord: Word = { word: 'test', added: date };
    mockUserRepository.checkIfUserHasWordInHistory.mockResolvedValue(false);
    mockUserRepository.registerWordToHistory.mockResolvedValue(mockWord);

    const result = await viewEntry.execute('user-id', 'test');

    expect(mockUserRepository.checkIfUserHasWordInHistory).toHaveBeenCalledWith('user-id', 'test');
    expect(mockUserRepository.registerWordToHistory).toHaveBeenCalledWith('user-id', 'test');
    expect(result).toEqual(mockWord);
  });

  it('deve lançar um erro caso o registro da palavra falhe', async () => {
    mockUserRepository.checkIfUserHasWordInHistory.mockResolvedValue(false);
    mockUserRepository.registerWordToHistory.mockImplementation(() => {
      throw new Error('Failed to register word');
    });

    await expect(viewEntry.execute('user-id', 'test')).rejects.toThrowError(
      'Failed to register word'
    );
  });
});
