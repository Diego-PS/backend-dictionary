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
- Prettier
- Jest
- React
- TailwindCSS

### Apresentação
https://youtu.be/A1UOYcBk6tk

### Instalação

Pré-requisitos: Possuir Node com NPM e Docker

1. Go to the server folder
```console
cd server
```

2. Inside the server folder, run docker-compose
```console
docker-compose up
```

3. Install dependencies
```console
npm install
```

4. Import dictionary
```console
npm run import-dictionary
```

5. Run the tests
```console
npx nyc npm test
```

6. Run the server
```console
npm run dev
```

7. Go to the client folder
```console
cd ../client
```

8. Install dependencies
```console
npm install
```

9. Run the client
```console
npm run dev
````

10. Visit http://localhost:5173/ to access the system
