import { ChildProcess, fork, ForkOptions } from 'child_process'
import { watch } from 'chokidar-debounced'
import chokidar from 'chokidar'
import path from 'path'
import { printBuildResult } from './builder'
import { CustomBuildResult, ServerOptions } from './types'
import { buildServer } from './buildServer'
import { parseServerOptions } from './options'

let serverProc: ChildProcess = null

const startServer = (options: ServerOptions) => {
  const _path = path.resolve(options.outputDirPath, options.outputJsFileName)
  const forkOptions: ForkOptions = {
    env: process.env, execArgv: [`--inspect=127.0.0.1:${options.debugPort}`],
  }
  // Start server process with a custom debug port of 5003. This must be kept in-sync with /.vscode/launch.json
  serverProc = fork(_path, forkOptions)
}

const startRebuildWatch = (options: ServerOptions, buildResult: CustomBuildResult) => {
  watch(() => {
    // Kill existing server process
    serverProc?.kill()
    console.log(`Changes detected [${new Date().toLocaleTimeString()}], rebuilding server...`)
    const startTime = Date.now()
    // Rebuild server
    buildResult.buildResult.rebuild().then(_result => {
      console.log('Done.')
      printBuildResult(_result, startTime)
      // Start server again
      startServer(options)
      console.log('Watching for changes...')
    }).catch(() => undefined) // Prevent from exiting the process
  }, options.watchedDirectoryPaths, 500, () => console.log('Watching for changes...'))
}

let initialBuildWatcher: chokidar.FSWatcher = null
export const watchServer = (options: ServerOptions) => {
  const _options = parseServerOptions(options)

  // Try initial build attempt
  buildServer(_options)
    // If initial build successful, start rebuild watch
    .then(result => {
      initialBuildWatcher?.close()
      // Start initial server process, before the first rebuild
      startServer(_options)
      startRebuildWatch(_options, result)
    })
    .catch(() => {
      if (initialBuildWatcher != null)
        return

      initialBuildWatcher = chokidar.watch(_options.watchedDirectoryPaths)
      watch(() => watchServer(_options), initialBuildWatcher, 500, () => console.log('Watching for changes...'))
    })
}
