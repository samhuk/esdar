import * as esbuild from 'esbuild'
import path from 'path'
import { ServerOptions } from './types'
import { createBuilder } from './builder'
import { parseServerOptions } from './options'

const nativeNodeModulesPlugin = {
  name: 'native-node-modules',
  setup(build: any) {
    // If a ".node" file is imported within a module in the "file" namespace, resolve
    // it to an absolute path and put it into the "node-file" virtual namespace.
    build.onResolve({ filter: /\.node$/, namespace: 'file' }, (args: any) => ({
      path: require.resolve(args.path, { paths: [args.resolveDir] }),
      namespace: 'node-file',
    }))

    // Files in the "node-file" virtual namespace call "require()" on the
    // path from esbuild of the ".node" file in the output directory.
    build.onLoad({ filter: /.*/, namespace: 'node-file' }, (args: any) => ({
      contents: `
        import path from ${JSON.stringify(args.path)}
        try { module.exports = require(path) }
        catch {}
      `,
    }))

    // If a ".node" file is imported within a module in the "node-file" namespace, put
    // it in the "file" namespace where esbuild's default loading behavior will handle
    // it. It is already an absolute path since we resolved it to one above.
    build.onResolve({ filter: /\.node$/, namespace: 'node-file' }, (args: any) => ({
      path: args.path,
      namespace: 'file',
    }))

    // Tell esbuild's default loading behavior to use the "file" loader for
    // these ".node" files.
    const opts = build.initialOptions
    opts.loader = opts.loader || {}
    opts.loader['.node'] = 'file'
  },
}

const createServerBuilder = (options: ServerOptions) => {
  const _options = parseServerOptions(options)

  return () => esbuild.build({
    entryPoints: [_options.entrypointFilePath],
    outfile: path.resolve(_options.outputDirPath, _options.outputJsFileName),
    bundle: true,
    minify: _options.prod,
    sourcemap: !_options.prod,
    metafile: true,
    incremental: !_options.prod,
    platform: 'node',
    external: _options.external,
    plugins: [nativeNodeModulesPlugin],
    loader: {
      '.sql': 'text',
    },
  }).then(result => ({ buildResult: result }))
}

export const buildServer = (options: ServerOptions) => createBuilder('server', createServerBuilder(options))()
