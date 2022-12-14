import * as fs from 'fs'
import * as path from 'path'
import { BuildResult } from 'esbuild'
import { JSDOM } from 'jsdom'

const includeJsFile = (document: Document, href: string) => {
  const scriptEl = document.createElement('script')
  scriptEl.defer = true
  scriptEl.src = href
  document.head.appendChild(scriptEl)
}

const includeCssFile = (document: Document, href: string) => {
  const linkEl = document.createElement('link')
  linkEl.rel = 'stylesheet'
  linkEl.href = href
  document.head.appendChild(linkEl)
}

const includeIcoFile = (document: Document, href: string) => {
  const linkEl = document.createElement('link')
  linkEl.rel = 'icon'
  linkEl.href = href
  linkEl.type = 'image/x-icon'
  document.head.appendChild(linkEl)
}

const includeFile = (document: Document, outputDir: string, outputPath: string) => {
  const relativizedPath = path.relative(outputDir, outputPath)
  const href = `/${relativizedPath}`
  if (outputPath.endsWith('.js'))
    includeJsFile(document, href)
  else if (outputPath.endsWith('.css'))
    includeCssFile(document, href)
  else if (outputPath.endsWith('.ico'))
    includeIcoFile(document, href)
}

console.log()

/**
 * Rudimentary copy of the HtmlPlugin of webpack. Creates a HTML file for the given
 * build result and html index file, adding <script> and <link> elements to reference
 * the output files.
 */
export const createIndexHtmlFileText = (
  result: BuildResult,
  faviconOutputPath: string | null,
  indexHtmlFilePath: string,
  outputDir: string,
): string => {
  let htmlFileText: string = null
  try {
    htmlFileText = fs.readFileSync(indexHtmlFilePath, { encoding: 'utf8' })
  }
  catch (e) {
    console.log('ERROR: Could not access index.html file.', e)
    return ''
  }
  const jsdom = new JSDOM(htmlFileText)
  const document = jsdom.window.document

  if (document.head == null)
    console.log('ERROR: index.html file does not have a <head> element. Please add one.')

  Object.entries(result.metafile.outputs).forEach(([outputPath]) => includeFile(document, outputDir, outputPath))

  if (faviconOutputPath != null)
    includeIcoFile(document, `/${path.relative(outputDir, faviconOutputPath)}`)

  return jsdom.serialize()
}
