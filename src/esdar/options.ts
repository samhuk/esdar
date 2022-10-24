import { ClientOptions, ServerOptions } from './types'

export const parseClientOptions = (options: ClientOptions): ClientOptions => ({
  entrypointFilePath: options.entrypointFilePath ?? './src/client/main.tsx',
  outputDirPath: options.outputDirPath ?? './build/client',
  outputJsFileName: options.outputJsFileName ?? 'out.js',
  prod: options.prod ?? false,
  watchedDirectoryPaths: options.watchedDirectoryPaths ?? ['./src/client', './src/common'],
  faviconFilePath: options.faviconFilePath ?? './src/client/favicon.html',
  indexHtmlFilePath: options.indexHtmlFilePath ?? './src/client/index.html',
})

export const parseServerOptions = (options: ServerOptions): ServerOptions => ({
  entrypointFilePath: options.entrypointFilePath ?? './src/server/index.ts',
  external: options.external ?? ['livereload-js', 'pg-native'],
  outputDirPath: options.outputDirPath ?? './build/server',
  outputJsFileName: options.outputJsFileName ?? 'out.js',
  prod: options.prod ?? false,
  watchedDirectoryPaths: options.watchedDirectoryPaths ?? ['./src/server', './src/common'],
  debugPort: options.debugPort ?? 5003,
})
