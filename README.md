<h1 align="center">esdar</h1>
<p align="center">
  <em>esbuild chokidar wrapper</em>
</p>

<p align="center">
  <a href="https://img.shields.io/badge/License-MIT-green.svg" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="license" />
  </a>
  <a href="https://badge.fury.io/js/esdar.svg" target="_blank">
    <img src="https://badge.fury.io/js/esdar.svg" alt="npm version" />
  </a>
</p>

## Overview

This is a work-in-progress package that wraps [esbuild](https://github.com/evanw/esbuild) and [chokidar](https://github.com/paulmillr/chokidar) to  achieve hot-reloading server+client building functionality. At the moment, esdar is primarily used for packages like [tree-starter](https://github.com/samhuk/tree-starter) to extract out this functionality, however in the future it could be adapted to suit more general use cases if desired.

To see a real-world use case of esdar, check out [tree-starter](https://github.com/samhuk/tree-starter).

## Usage Overview

```typescript
import {
  buildClient as buildClientEsdar,
  buildServer as buildServerEsdar,
  watchClient as watchClientEsdar,
  watchServer as watchServerEsdar,
  ClientOptions,
  ServerOptions,
} from 'esdar'

const clientOptions: ClientOptions = {
  prod: process.env.NODE_ENV === 'production',
  entrypointFilePath: './src/client/main.tsx',
  faviconFilePath: './src/client/favicon.ico',
  indexHtmlFilePath: './src/client/index.html',
  outputDirPath: './build/client',
  outputJsFileName: 'out.js',
  watchedDirectoryPaths: ['./src/client', './src/common'],
}

const serverOptions: ServerOptions = {
  prod: process.env.NODE_ENV === 'production',
  entrypointFilePath: './src/server/index.ts',
  outputDirPath: './build/server',
  outputJsFileName: 'out.js',
  watchedDirectoryPaths: ['./src/server', './src/common'],
  debugPort: 5003,
  external: ['livereload-js', 'pg-native'],
}

export const buildClient = () => buildClientEsdar(clientOptions)

export const buildServer = () => buildServerEsdar(serverOptions)

export const watchClient = () => watchClientEsdar(clientOptions)

export const watchServer = () => watchServerEsdar(serverOptions)
```

## Examples

Used by [tree-starter](https://github.com/samhuk/tree-starter).

## Development

See [./contributing/development.md](./contributing/development.md)

---

If you found this package delightful, feel free to [buy me a coffee ✨](https://www.buymeacoffee.com/samhuk)
