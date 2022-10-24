import { BuildResult } from 'esbuild'

export type BuildOutput = {
  path: string
  sizeBytes: number
}

export type CustomBuildResult = { buildResult: BuildResult, additionalOutputs?: BuildOutput[] }

export type ClientOptions = {
  /**
   * @default './src/client/index.html'
   */
  indexHtmlFilePath: string
  /**
   * @default './src/client/favicon.html'
   */
  faviconFilePath: string
  /**
   * @default './src/client/main.tsx'
   */
  entrypointFilePath: string
  /**
   * @default './build/client'
   */
  outputDirPath: string
  /**
   * @default 'out.js'
   */
  outputJsFileName: string
  /**
   * @default ['./src/client', './src/common']
   */
  watchedDirectoryPaths: string[]
  /**
   * @default false
   */
  prod: boolean
}

export type ServerOptions = {
  /**
   * @default './src/server/index.ts'
   */
  entrypointFilePath: string
  /**
   * @default './build/server'
   */
  outputDirPath: string
  /**
   * @default 'out.js'
   */
  outputJsFileName: string
  /**
   * @default ['./src/server', './src/common']
   */
  watchedDirectoryPaths: string[]
  /**
   * @default false
   */
  prod: boolean
  /**
   * @default ['livereload-js', 'pg-native']
   */
  external: string[]
  /**
   * @default 5003
   */
  debugPort: number
}
