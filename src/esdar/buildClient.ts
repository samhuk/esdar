import * as esbuild from 'esbuild'
import sassPlugin from 'esbuild-sass-plugin'
import path from 'path'
import * as fs from 'fs'
import { ClientOptions } from './types'
import { createIndexHtmlFileText } from './esbuildHtmlFilePlugin'
import { gzipLargeFiles } from './gzip'
import { createBuilder } from './builder'
import { parseClientOptions } from './options'

const createClientBuilder = (options: ClientOptions) => {
  const _options = parseClientOptions(options)
  const outputJsFilePath = path.resolve(_options.outputDirPath, _options.outputJsFileName)
  const indexHtmlFileOutputPath = path.relative(path.resolve('./'), path.resolve(_options.outputDirPath, 'index.html'))
  const faviconFileOutputPath = path.relative(path.resolve('./'), path.resolve(_options.outputDirPath, 'favicon.ico'))

  return () => esbuild.build({
    entryPoints: [_options.entrypointFilePath],
    outfile: outputJsFilePath,
    bundle: true,
    minify: _options.prod,
    sourcemap: !_options.prod,
    metafile: true,
    incremental: !_options.prod,
    plugins: [sassPlugin() as unknown as esbuild.Plugin],
    loader: {
      '.ttf': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
  }).then(result => {
    // Create index.html file, referencing build outputs
    const indexHtmlFileText = createIndexHtmlFileText(result, faviconFileOutputPath, _options.indexHtmlFilePath, _options.outputDirPath)
    // Copy over additional related files to build dir
    fs.writeFileSync(indexHtmlFileOutputPath, indexHtmlFileText)
    fs.copyFileSync(options.faviconFilePath, faviconFileOutputPath)

    if (_options.prod)
      gzipLargeFiles(_options.outputDirPath)

    return {
      buildResult: result,
      additionalOutputs: [
        { path: indexHtmlFileOutputPath, sizeBytes: Buffer.from(indexHtmlFileText).length },
        { path: faviconFileOutputPath, sizeBytes: fs.statSync(_options.faviconFilePath).size },
      ],
    }
  })
}

export const buildClient = (options: ClientOptions) => createBuilder('client', createClientBuilder(options))()
