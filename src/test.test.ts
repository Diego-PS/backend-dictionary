// Imports e configuração inicial

import { AuthController,UserController,EntriesController } from './controllers';
import { Signin, Signup, GetFavorites, GetHistory, GetUserProfile,WordsReponseBody, GetEntries, ViewEntry, AddWordToFavorites, removeWordFromFavorites } from './usecases';
import { Metadata, Word } from 'entities'; 
import { Request, Response } from 'express';
import { CacheInterface } from 'interfaces';

import { UserRepositoryInterface, WordRepositoryInterface } from './interfaces';

// Mock de dependências
const userRepositoryMock: Partial<UserRepositoryInterface> = {
  checkIfWordIsInFavorites: jest.fn(),
  addWordToFavorites: jest.fn(),
  removeWordFromFavorites: jest.fn(),
};

const wordRepositoryMock: Partial<WordRepositoryInterface> = {};
const cacheMock: Partial<CacheInterface> = { execute: jest.fn() };
const signupUseCaseMock: Partial<Signup> = { execute: jest.fn() };
const signinUseCaseMock: Partial<Signin> = { execute: jest.fn() };

// Mock de Request e Response
const mockRequest = (body: any, params: any = {}, query: any = {}) => ({
  body,
  params,
  query,
});
const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.set = jest.fn().mockReturnValue(res);
  return res;
};

// Testes para AddWordToFavorites
describe('AddWordToFavorites', () => {
  const addWordToFavorites = new AddWordToFavorites(
    userRepositoryMock as UserRepositoryInterface,
    wordRepositoryMock as WordRepositoryInterface
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve adicionar uma palavra aos favoritos com sucesso', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);
    (userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({ word: 'teste' });

    const result = await addWordToFavorites.execute('user1', 'teste');
    expect(result).toEqual({ word: 'teste' });
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith('user1', 'teste');
    expect(userRepositoryMock.addWordToFavorites).toHaveBeenCalledWith('user1', 'teste');
  });

  it('deve lançar erro ao adicionar palavra já existente nos favoritos', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(true);

    await expect(addWordToFavorites.execute('user1', 'teste')).rejects.toThrow(
      'word teste is already in favorites'
    );
  });

  it('deve lançar erro quando falhar ao adicionar palavra aos favoritos', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);
    (userRepositoryMock.addWordToFavorites as jest.Mock).mockRejectedValue(new Error('word  is already in favorites'));

    await expect(addWordToFavorites.execute('user1', 'teste')).rejects.toThrow('word  is already in favorites');
  });

  it('deve falhar quando o ID do usuário está vazio', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);

    await expect(addWordToFavorites.execute('', 'teste')).rejects.toThrow('word  is already in favorites');
  });

  it('deve lançar erro se o argumento "word" estiver vazio', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);

    await expect(addWordToFavorites.execute('user1', '')).rejects.toThrow('Invalid characters in word: ');
  });

  it('deve verificar se "checkIfWordIsInFavorites" é chamado antes de "addWordToFavorites"', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);
    (userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({ word: 'teste' });

    await addWordToFavorites.execute('user1', 'teste');

    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalled(
    );
  });

  it('deve verificar comportamento para palavra com espaços extras', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);
    (userRepositoryMock.addWordToFavorites as jest.Mock).mockResolvedValue({ word: ' teste ' });

    const result = await addWordToFavorites.execute('user1', ' teste ');
    expect(result).toEqual({ word: ' teste ' });
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith('user1', ' teste ');
    expect(userRepositoryMock.addWordToFavorites).toHaveBeenCalledWith('user1', ' teste ');
  });

  it('deve lançar erro ao adicionar palavra com caracteres inválidos', async () => {
    const invalidWord = 't3$t3!';
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);

    await expect(addWordToFavorites.execute('user1', invalidWord)).rejects.toThrow(
      'Invalid characters in word: t3$t3!'
    );
  });
});


// Testes para removeWordFromFavorites
// Testes para removeWordFromFavorites
describe('removeWordFromFavorites', () => {
  const removeWord = new removeWordFromFavorites(
    userRepositoryMock as UserRepositoryInterface,
    wordRepositoryMock as WordRepositoryInterface
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve remover uma palavra dos favoritos com sucesso', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(true);
    (userRepositoryMock.removeWordFromFavorites as jest.Mock).mockResolvedValue({ word: 'teste' });

    const result = await removeWord.execute('user1', 'teste');
    expect(result).toEqual({ word: 'teste' });
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    );
    expect(userRepositoryMock.removeWordFromFavorites).toHaveBeenCalledWith(
      'user1',
      'teste'
    );
  });

  it('deve lançar erro ao tentar remover palavra inexistente', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);

    await expect(removeWord.execute('user1', 'teste')).rejects.toThrow(
      'The word teste is not in favorites'
    );
  });

  it('deve lançar erro ao tentar remover palavra inexistente com caracteres invalidos', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);

    await expect(removeWord.execute('user1', 't3$t3')).rejects.toThrow(
      'Invalid characters in word: t3$t3'
    );
  });

  it('deve lançar erro ao tentar remover palavra com caracteres inválidos', async () => {
    const invalidWord = 't3$t3!';
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(true);

    await expect(removeWord.execute('user1', invalidWord)).rejects.toThrow(
      'Invalid characters in word: t3$t3!'
    );
  });

  it('deve lançar erro quando falhar ao remover palavra dos favoritos', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(true);
    (userRepositoryMock.removeWordFromFavorites as jest.Mock).mockRejectedValue(new Error('Failed to remove word'));

    await expect(removeWord.execute('user1', 'teste')).rejects.toThrow('Failed to remove word');
  });

  it('deve verificar que a palavra foi removida dos favoritos', async () => {
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(true);
    (userRepositoryMock.removeWordFromFavorites as jest.Mock).mockResolvedValue({ word: 'teste' });

    await removeWord.execute('user1', 'teste');
    expect(userRepositoryMock.checkIfWordIsInFavorites).toHaveBeenCalledWith('user1', 'teste');
    expect(userRepositoryMock.removeWordFromFavorites).toHaveBeenCalledWith('user1', 'teste');
    (userRepositoryMock.checkIfWordIsInFavorites as jest.Mock).mockResolvedValue(false);
    await expect(removeWord.execute('user1', 'teste')).rejects.toThrow('The word teste is not in favorites');
  });
});


// Testes para AuthController

describe('AuthController', () => {
  const authController = new AuthController(
    signupUseCaseMock as Signup,
    signinUseCaseMock as Signin
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Signup Tests
  it('deve realizar signup com sucesso', async () => {
    (signupUseCaseMock.execute as jest.Mock).mockResolvedValue({ id: '1', name: 'John', token: 'abc' });

    const req = mockRequest({ name: 'John', email: 'john@example.com', password: '1234' });
    const res = mockResponse();

    await authController.signup(req as any, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ id: '1', name: 'John', token: 'abc' });
  });

  it('deve lançar erro no signup com email duplicado', async () => {
    (signupUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Email already exists'));

    const req = mockRequest({ name: 'John', email: 'duplicate@example.com', password: '1234' });
    const res = mockResponse();

    await expect(authController.signup(req as any, res as Response)).rejects.toThrow(
      'Email already exists'
    );
  });

  it('deve lançar erro ao tentar signup com dados inválidos', async () => {
    // Adjust mock to simulate invalid input error
    (signupUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Invalid input data'));

    const req = mockRequest({ name: '', email: 'invalidemail', password: '' });
    const res = mockResponse();

    await expect(authController.signup(req as any, res as Response)).rejects.toThrow(
      'Invalid input data'
    );
  });

  it('deve lançar erro genérico ao falhar no signup', async () => {
    (signupUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const req = mockRequest({ name: 'John', email: 'john@example.com', password: '1234' });
    const res = mockResponse();

    await expect(authController.signup(req as any, res as Response)).rejects.toThrow(
      'Unexpected error'
    );
  });

  // Signin Tests
  it('deve realizar signin com sucesso', async () => {
    (signinUseCaseMock.execute as jest.Mock).mockResolvedValue({ id: '1', name: 'John', token: 'abc' });

    const req = mockRequest({ email: 'john@example.com', password: '1234' });
    const res = mockResponse();

    await authController.signin(req as any, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ id: '1', name: 'John', token: 'abc' });
  });

  it('deve lançar erro ao tentar signin com credenciais inválidas', async () => {
    (signinUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Incomplete input data'));

    const req = mockRequest({ email: 'john@example.com', password: 'wrongpassword' });
    const res = mockResponse();

    await expect(authController.signin(req as any, res as Response)).rejects.toThrow(
      'Incomplete input data'
    );
  });

  it('deve lançar erro ao tentar signin com dados incompletos', async () => {
    // Adjust mock to simulate incomplete input data error
    const req = mockRequest({ email: '', password: '' });
    const res = mockResponse();

    await expect(authController.signin(req as any, res as Response)).rejects.toThrow(
      'Incomplete input data'
    );
  });

  it('deve lançar erro genérico ao falhar no signin', async () => {
    (signinUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const req = mockRequest({ email: 'john@example.com', password: '1234' });
    const res = mockResponse();

    await expect(authController.signin(req as any, res as Response)).rejects.toThrow(
      'Unexpected error'
    );
  });
});

// Testes para EntriesController
describe('EntriesController', () => {
  const getEntriesUseCaseMock: Partial<GetEntries> = { execute: jest.fn() };
  const viewEntryUseCaseMock: Partial<ViewEntry> = { execute: jest.fn() };

  const entriesController = new EntriesController(
    getEntriesUseCaseMock as GetEntries,
    viewEntryUseCaseMock as ViewEntry,
    new AddWordToFavorites(userRepositoryMock as UserRepositoryInterface, wordRepositoryMock as WordRepositoryInterface),
    new removeWordFromFavorites(userRepositoryMock as UserRepositoryInterface, wordRepositoryMock as WordRepositoryInterface),
    cacheMock as CacheInterface
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter entradas com sucesso', async () => {
    (cacheMock.execute as jest.Mock).mockResolvedValue({
      value: { entries: [] },
      metadata: { cache: 'HIT', responseTime: '10ms' },
    });

    const req = mockRequest({}, {}, { search: 'word', page: '1', limit: '10' });
    const res = mockResponse();

    await entriesController.getEntries(req as any, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ entries: [] });
  });

  it('deve lançar erro quando falhar ao obter entradas do cache', async () => {
    (cacheMock.execute as jest.Mock).mockRejectedValue(new Error('Cache fetch failed'));

    const req = mockRequest({}, {}, { search: 'word', page: '1', limit: '10' });
    const res = mockResponse();

    await expect(entriesController.getEntries(req as any, res as Response)).rejects.toThrow('Cache fetch failed');
  });
});


describe('UserController', () => {
  let userController: UserController;
  let getUserProfileUseCase: jest.Mocked<GetUserProfile>;
  let getHistoryUseCase: jest.Mocked<GetHistory>;
  let getFavoritesUseCase: jest.Mocked<GetFavorites>;
  let cache: jest.Mocked<CacheInterface>;

  beforeEach(() => {
    getUserProfileUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetUserProfile>;

    getHistoryUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetHistory>;

    getFavoritesUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetFavorites>;

    cache = {
      execute: jest.fn(),
      set: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<CacheInterface>;

    userController = new UserController(
      getUserProfileUseCase,
      getHistoryUseCase,
      getFavoritesUseCase,
      cache
    );
  });

  describe('getUserProfile', () => {
    it('deve retornar o perfil do usuario do cache e responder com 200 ', async () => {
      const req = { id: '123' } as any;
      const res = {
        status: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      const mockProfile = { id: '123', name: 'teste', email: 'teste@exemplo.com' };
      const mockMetadata: Metadata = { cache: 'HIT', responseTime: 10 };
      cache.execute.mockResolvedValueOnce({ value: mockProfile, metadata: mockMetadata });

      await userController.getUserProfile(req, res);

      expect(cache.execute).toHaveBeenCalledWith('123', getUserProfileUseCase.execute, '123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.set).toHaveBeenCalledWith({
        'x-cache': 'HIT',
        'x-response-time': 10,
      });
      expect(res.send).toHaveBeenCalledWith(mockProfile);
    });
  });

  describe('getHistory', () => {
    it('deve retornar o historico', async () => {
      const date: Date = new Date();
      const mockHistory: WordsReponseBody = {
        results: [{word: 'hello', added: date}], 
        totalDocs: 1,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      getHistoryUseCase.execute.mockResolvedValueOnce(mockHistory);

      const result = await getHistoryUseCase.execute('123', { page: 1, limit: 10 });

      expect(result).toEqual(mockHistory);
      expect(getHistoryUseCase.execute).toHaveBeenCalledWith('123', { page: 1, limit: 10 });
    });
  });

  describe('getFavorites', () => {
    const date: Date = new Date();
    it('deve retornar os favoritos', async () => {
      const mockFavorites: WordsReponseBody = {
        results: [{word: 'hello', added: date}],
        totalDocs: 1,
        page: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      getFavoritesUseCase.execute.mockResolvedValueOnce(mockFavorites); 

      const result = await getFavoritesUseCase.execute('123', { page: 1, limit: 10 });

      expect(result).toEqual(mockFavorites);
      expect(getFavoritesUseCase.execute).toHaveBeenCalledWith('123', { page: 1, limit: 10 });
    });
  });
});



describe('ViewEntry', () => {
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>
  let mockWordRepository: jest.Mocked<WordRepositoryInterface>
  let viewEntry: ViewEntry

  beforeEach(() => {
    mockUserRepository = {
      checkIfUserHasWordInHistory: jest.fn(),
      registerWordToHistory: jest.fn(),
    } as unknown as jest.Mocked<UserRepositoryInterface>

    mockWordRepository = {
      getWord: jest.fn(),
    } as unknown as jest.Mocked<WordRepositoryInterface>

    viewEntry = new ViewEntry(mockUserRepository, mockWordRepository)
  })

  it('deve retornar "word" se o usuario nao tiver nenhuma palavra salva ', async () => {
    const date: Date = new Date();
    const mockWord: Word = { word: 'test', added: date }
    mockUserRepository.checkIfUserHasWordInHistory.mockResolvedValue(true)
    mockWordRepository.getWord.mockResolvedValue(mockWord)

    const result = await viewEntry.execute('user-id', 'test')

    expect(mockUserRepository.checkIfUserHasWordInHistory).toHaveBeenCalledWith('user-id', 'test')
    expect(mockWordRepository.getWord).toHaveBeenCalledWith('test')
    expect(result).toEqual(mockWord)
  })

  it(' deve registrar uma palavra para o historico e retornar a informacao da palavra se o usuario nao tiver ela no historico', async () => {
    const date: Date = new Date();
    const mockWord: Word = { word: 'test', added: date }
    mockUserRepository.checkIfUserHasWordInHistory.mockResolvedValue(false)
    mockUserRepository.registerWordToHistory.mockResolvedValue(mockWord)

    const result = await viewEntry.execute('user-id', 'test')

    expect(mockUserRepository.checkIfUserHasWordInHistory).toHaveBeenCalledWith('user-id', 'test')
    expect(mockUserRepository.registerWordToHistory).toHaveBeenCalledWith('user-id', 'test')
    expect(result).toEqual(mockWord)
  })

  it('deve lancar um erro caso o registro da palavra falhar', async () => {
    mockUserRepository.checkIfUserHasWordInHistory.mockResolvedValue(false)
    mockUserRepository.registerWordToHistory.mockImplementation(() => {
      throw new Error('Failed to register word')
    })

    await expect(viewEntry.execute('user-id', 'test')).rejects.toThrowError(
      'Failed to register word'
    )
  })
})