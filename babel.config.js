// eslint-disable-next-line no-undef
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          // This needs to be mirrored in tsconfig.json
          entities: './src/entities/index.ts',
          interfaces: './src/interfaces/index.ts',
          utils: './src/utils/index.ts',
          controllers: './src/controllers/index.ts',
          routes: './src/routes/index.ts',
          schemas: './src/database/schemas/index.ts',
          models: './src/database/models/index.ts',
          'database-interfaces': './src/database/interfaces/index.ts',
          repositories: './src/repositories/index.ts',
          'use-cases': './src/usecases/index.ts',
          middlewares: './src/middlewares/index.ts',
        },
      },
    ],
  ],
}
