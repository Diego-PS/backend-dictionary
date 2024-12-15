// Imports e configuração inicial

import { AuthController,UserController,EntriesController } from './controllers';

import { Signin, Signup, GetFavorites, GetHistory, 
  GetUserProfile,WordsReponseBody, GetEntries, 
  ViewEntry, AddWordToFavorites, removeWordFromFavorites } from './usecases';

import { Metadata, Word, SearchQuery,PaginationQuery } from 'entities'; 

import { Request, Response } from 'express';

import { CacheInterface,HasherInterface,JsonWebTokenInterface,
   WordRepositoryInterface,UserRepositoryInterface } from 'interfaces';

// Mock de dependências
const userRepositoryMock: jest.Mocked<UserRepositoryInterface> = {
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

// Teste para Signup

const hasherMock: jest.Mocked<HasherInterface> = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const jwtMock: jest.Mocked<JsonWebTokenInterface> = {
  generate: jest.fn(),
  verify: jest.fn(),
};

describe('Signup Use Case', () => {
  let signup: Signup;
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
  let hasherMock: jest.Mocked<HasherInterface>;
  let jwtMock: jest.Mocked<JsonWebTokenInterface>;

  beforeEach(() => {
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

    hasherMock = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    jwtMock = {
      generate: jest.fn(),
      verify: jest.fn(),
    };

    signup = new Signup(userRepositoryMock, hasherMock, jwtMock);
  });

  it('should successfully register a user and return user data with a token', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.create.mockResolvedValue({
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    });
    hasherMock.hash.mockResolvedValue('hashedpassword');
    jwtMock.generate.mockReturnValue('generated_token');

    const result = await signup.execute('John', 'john@example.com', 'password123');

    expect(result).toEqual({ id: '1', name: 'John', token: 'generated_token' });
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(userRepositoryMock.create).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    });
    expect(hasherMock.hash).toHaveBeenCalledWith('password123');
    expect(jwtMock.generate).toHaveBeenCalledWith('1');
  });

  it('should throw an error if the email is invalid', async () => {
    await expect(
      signup.execute('John', 'invalid-email', 'password123')
    ).rejects.toThrow('A valid email is required to signup');
  });

  it('should throw an error if the password is empty', async () => {
    await expect(
      signup.execute('John', 'john@example.com', '')
    ).rejects.toThrow('A password is required to signup');
  });

  it('should throw an error if the user with the given email already exists', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue({
      id: '2',
      name: 'Existing User',
      email: 'john@example.com',
      password: 'hashedpassword',
    });

    await expect(
      signup.execute('John', 'john@example.com', 'password123')
    ).rejects.toThrow('User with email john@example.com is already registered');
  });

  it('should throw an error if the user repository fails to create a user', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);
    hasherMock.hash.mockResolvedValue('hashedpassword');
    userRepositoryMock.create.mockRejectedValue(new Error('Database error'));

    await expect(
      signup.execute('John', 'john@example.com', 'password123')
    ).rejects.toThrow('Database error');
  });
});

// Testes para Signin

describe('Signin Use Case', () => {
  let signin: Signin;
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
  let hasherMock: jest.Mocked<HasherInterface>;
  let jwtMock: jest.Mocked<JsonWebTokenInterface>;

  beforeEach(() => {
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

    hasherMock = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    jwtMock = {
      generate: jest.fn(),
      verify: jest.fn(),
    };

    signin = new Signin(userRepositoryMock, hasherMock, jwtMock);
  });

  it('should successfully sign in a user and return user data with a token', async () => {
    const mockUser = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    };

    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    hasherMock.compare.mockResolvedValue(true);
    jwtMock.generate.mockReturnValue('generated_token');

    const result = await signin.execute('john@example.com', 'password123');

    expect(result).toEqual({ id: '1', name: 'John', token: 'generated_token' });
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'john@example.com'
    );
    expect(hasherMock.compare).toHaveBeenCalledWith(
      'password123',
      'hashedpassword'
    );
    expect(jwtMock.generate).toHaveBeenCalledWith('1');
  });

  it('should throw an error if the email does not exist', async () => {
    userRepositoryMock.findByEmail.mockResolvedValue(null);

    await expect(
      signin.execute('nonexistent@example.com', 'password123')
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error if the password does not match', async () => {
    const mockUser = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      password: 'hashedpassword',
    };
  
    userRepositoryMock.findByEmail.mockResolvedValue(mockUser);
    hasherMock.compare.mockResolvedValue(false); // Mock password comparison as false
  
    await expect(
      signin.execute('john@example.com', 'wrongpassword')
    ).rejects.toThrow('Invalid email or password');
  
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(
      'john@example.com'
    );
    expect(hasherMock.compare).toHaveBeenCalledWith(
      'wrongpassword',
      'hashedpassword'
    );
  });

  it('should throw an error if the user repository fails to find a user', async () => {
    userRepositoryMock.findByEmail.mockRejectedValue(new Error('Database error'));

    await expect(
      signin.execute('john@example.com', 'password123')
    ).rejects.toThrow('Database error');
  });
});

// Teste para GetEntries

describe('GetEntries Use Case', () => {
  let wordRepositoryMock: jest.Mocked<WordRepositoryInterface>;
  let getEntries: GetEntries;

  beforeEach(() => {
    wordRepositoryMock = {
      register: jest.fn(),
      get: jest.fn(),
      getWord: jest.fn(),
    };
    getEntries = new GetEntries(wordRepositoryMock);
  });

  it('should return the correct pagination details and results', async () => {
    const date0: Date = new Date();
    const date10: Date = new Date();
    const query: SearchQuery = { limit: 2, page: 1 };
    wordRepositoryMock.get.mockResolvedValue({
      words: [
        {word: 'hello0', added: date0},
        {word: 'hello10', added: date10},
      ],
      totalWords: 5,
    });

    const response = await getEntries.execute(query);

    expect(response).toEqual({
      results: ['hello0', 'hello10'],
      totalDocs: 5,
      page: 1,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    });

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query);
  });

  it('should handle a query without pagination', async () => {
    const date1: Date = new Date();
    const date2: Date = new Date();
    const date3: Date = new Date();

    const query: SearchQuery = {};
    wordRepositoryMock.get.mockResolvedValue({
      words: [
        {word: 'hello1', added: date1},
        {word: 'hello2', added: date2},
        {word: 'hello3', added: date3},
      ],
      totalWords: 3,
    });

    const response = await getEntries.execute(query);

    expect(response).toEqual({
      results: ['hello1', 'hello2', 'hello3'],
      totalDocs: 3,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query);
  });

  it('should return no results for an empty query result', async () => {
    const query: SearchQuery = { limit: 5, page: 1 };
    wordRepositoryMock.get.mockResolvedValue({
      words: [],
      totalWords: 0,
    });

    const response = await getEntries.execute(query);

    expect(response).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query);
  });

  it('should calculate pagination details correctly for multiple pages', async () => {
    const date4: Date = new Date();
    const date5: Date = new Date();
    const date6: Date = new Date();
    const query: SearchQuery = { limit: 3, page: 2 };
    wordRepositoryMock.get.mockResolvedValue({
      words: [
        {word: 'hello4', added: date4},
        {word: 'hello5', added: date5},
        {word: 'hello6', added: date6},
      ],
      totalWords: 8,
    });

    const response = await getEntries.execute(query);

    expect(response).toEqual({
      results: ['hello4', 'hello5', 'hello6'],
      totalDocs: 8,
      page: 2,
      totalPages: 3,
      hasNext: true,
      hasPrev: true,
    });

    expect(wordRepositoryMock.get).toHaveBeenCalledWith(query);
  });
});

// Teste GetUserProfile

describe('GetUserProfile Use Case', () => {
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
  let getUserProfile: GetUserProfile;

  beforeEach(() => {
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
    getUserProfile = new GetUserProfile(userRepositoryMock);
  });

  it('should return the user profile when the user exists', async () => {
    // Mocking the findById method with the full User object including password
    userRepositoryMock.findById.mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password', // Mocking password property as required
    });

    const response = await getUserProfile.execute('1');

    expect(response).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });

    expect(userRepositoryMock.findById).toHaveBeenCalledWith('1');
  });

  it('should throw an error if the user does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(getUserProfile.execute('999')).rejects.toThrow(
      'Id 999 does not correspond to any user'
    );

    expect(userRepositoryMock.findById).toHaveBeenCalledWith('999');
  });
});


// Teste GetFavorites

describe('GetFavorites Use Case', () => {
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;
  let getFavorites: GetFavorites;

  beforeEach(() => {
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
    getFavorites = new GetFavorites(userRepositoryMock);
  });

  it('should return user favorite words with pagination when favorites exist', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
    ];

    userRepositoryMock.getFavorites.mockResolvedValue({
      words: mockWords,
      totalWords: mockWords.length,
    });

    const pagination: PaginationQuery = { page: 1, limit: 10 };
    const response = await getFavorites.execute('1', pagination);

    expect(response).toEqual<WordsReponseBody>({
      results: mockWords,
      totalDocs: mockWords.length,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith('1', pagination);
  });

  it('should return an empty favorites list when no favorites are found', async () => {
    userRepositoryMock.getFavorites.mockResolvedValue({
      words: [],
      totalWords: 0,
    });

    const pagination: PaginationQuery = { page: 1, limit: 10 };
    const response = await getFavorites.execute('1', pagination);

    expect(response).toEqual<WordsReponseBody>({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith('1', pagination);
  });

  it('should handle pagination with previous page (has previous)', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
      { word: 'word3', added: new Date() },
      { word: 'word4', added: new Date() },
    ];

    userRepositoryMock.getFavorites.mockResolvedValue({
      words: mockWords.slice(2), // mock second page
      totalWords: mockWords.length,
    });

    const pagination: PaginationQuery = { page: 2, limit: 2 };
    const response = await getFavorites.execute('1', pagination);

    expect(response).toEqual<WordsReponseBody>({
      results: mockWords.slice(2),
      totalDocs: mockWords.length,
      page: 2,
      totalPages: 2,
      hasNext: false,
      hasPrev: true,
    });

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith('1', pagination);
  });

  it('should handle case where limit is not specified in pagination', async () => {
    const mockWords: Word[] = [
      { word: 'word1', added: new Date() },
      { word: 'word2', added: new Date() },
    ];

    userRepositoryMock.getFavorites.mockResolvedValue({
      words: mockWords,
      totalWords: mockWords.length,
    });

    const pagination: PaginationQuery = { page: 1 }; // no limit specified
    const response = await getFavorites.execute('1', pagination);

    expect(response).toEqual<WordsReponseBody>({
      results: mockWords,
      totalDocs: mockWords.length,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });

    expect(userRepositoryMock.getFavorites).toHaveBeenCalledWith('1', pagination);
  });
});

//Testes para GetHistory

const mockWords: Word[] = [
  { word: 'word1', added: new Date() },
  { word: 'word2', added: new Date() },
  { word: 'word3', added: new Date() },
  { word: 'word4', added: new Date() },
];

describe('GetHistory Use Case', () => {
  let getHistory: GetHistory;

  beforeEach(() => {
    getHistory = new GetHistory(userRepositoryMock);
  });

  it('should return paginated results', async () => {
    userRepositoryMock.getHistory.mockResolvedValue({
      words: mockWords.slice(0, 2),
      totalWords: mockWords.length,
    });

    const pagination = { page: 1, limit: 2 };
    const response = await getHistory.execute('1', pagination);

    expect(response).toEqual({
      results: mockWords.slice(0, 2),
      totalDocs: mockWords.length,
      page: 1,
      totalPages: 2,
      hasNext: true,
      hasPrev: false,
    });
  });

  it('should handle case with no results', async () => {
    userRepositoryMock.getHistory.mockResolvedValue({
      words: [],
      totalWords: 0,
    });

    const pagination = { page: 1, limit: 2 };
    const response = await getHistory.execute('1', pagination);

    expect(response).toEqual({
      results: [],
      totalDocs: 0,
      page: 1,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('should handle case where limit is not provided', async () => {
    userRepositoryMock.getHistory.mockResolvedValue({
      words: mockWords,
      totalWords: mockWords.length,
    });

    const pagination = { page: 1 };
    const response = await getHistory.execute('1', pagination);

    expect(response).toEqual({
      results: mockWords,
      totalDocs: mockWords.length,
      page: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    });
  });

  it('should handle case with multiple pages and hasPrev', async () => {
    userRepositoryMock.getHistory.mockResolvedValue({
      words: mockWords.slice(2, 4),
      totalWords: mockWords.length,
    });

    const pagination = { page: 2, limit: 2 };
    const response = await getHistory.execute('1', pagination);

    expect(response).toEqual({
      results: mockWords.slice(2, 4),
      totalDocs: mockWords.length,
      page: 2,
      totalPages: 2,
      hasNext: false,
      hasPrev: true,
    });
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