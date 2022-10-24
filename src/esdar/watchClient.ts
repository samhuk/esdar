import chokidar from 'chokidar'
import { watch } from 'chokidar-debounced'
import { buildClient } from './buildClient'
import { printBuildResult } from './builder'
import { parseClientOptions } from './options'
import { ClientOptions, CustomBuildResult } from './types'

const startRebuildWatch = (options: ClientOptions, buildResult: CustomBuildResult) => {
  const buildVerbosity = 0 // TODO
  watch(() => {
    console.log(`Changes detected [${new Date().toLocaleTimeString()}], rebuilding client...`)
    const startTime = Date.now()
    // Rebuild client
    buildResult.buildResult.rebuild()
      .then(_result => {
        console.log(`Done (${Date.now() - startTime} ms).${buildVerbosity === 0 ? ' Watching for changes...' : ''}`)
        if (buildVerbosity > 0) {
          printBuildResult(_result, startTime)
          console.log('Watching for changes...')
        }
      })
      .catch(() => undefined) // Prevent from exiting the process
  }, options.watchedDirectoryPaths, 500, () => console.log('Watching for changes...'))
}

let initialBuildWatcher: chokidar.FSWatcher = null
export const watchClient = (options: ClientOptions) => {
  const _options = parseClientOptions(options)
  // Try initial build attempt
  buildClient(_options)
    // If initial build successful, start rebuild watch
    .then(result => {
      initialBuildWatcher.close()
      startRebuildWatch(_options, result)
    })
    .catch(() => {
      if (initialBuildWatcher != null)
        return
      initialBuildWatcher = chokidar.watch(_options.watchedDirectoryPaths)
      watch(() => watchClient(_options), initialBuildWatcher, 500, () => console.log('Watching for changes...'))
    })
}
