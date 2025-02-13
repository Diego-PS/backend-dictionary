### Nomes

- Eduardo Diniz Mio
- Diego Pereira da Silva
- Jose Vinicius de Lima

### Explicação

Pequeno sistema de visualização de dados a partir de um dicionário de palavras em inglês.

### Tecnologias

- Typescript
- Node.JS
- Express.JS
- MongoDB
- Redis
- ESLint
- Jest

### Instalação

Pré-requisitos: Possuir Node com NPM e Docker

1. Inside the cloned folder, run docker-compose
```console
docker-compose up
```

2. Install dependencies
```console
npm install
```

3. Import dictionary
```console
npm run import-dictionary
```

4. Run the tests
```console
npx nyc npm test
```

5. Run the server
```console
npm run dev
```
