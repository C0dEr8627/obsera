export interface ImportReference {
  rawSource: string
  normalizedSource: string
  isRelative: boolean
  resolvedPath: string | null
}

export interface ImportScanResult {
  filePath: string
  references: ImportReference[]
}

const stripComments = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')

const normalizeImportSource = (source: string): string =>
  source.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')

const isRelativeImport = (source: string): boolean =>
  source === '.' || source === '..' || source.startsWith('./') || source.startsWith('../')

const resolveRelativeImportPath = (filePath: string, importSource: string): string => {
  const normalizedImport = normalizeImportSource(importSource)
  if (!isRelativeImport(normalizedImport)) {
    return normalizedImport
  }

  const pathSegments = normalizeImportSource(filePath).split('/')
  const baseSegments = pathSegments.slice(0, -1)
  const importedSegments = normalizedImport.split('/')
  const resolvedSegments: string[] = [...baseSegments]

  for (const segment of importedSegments) {
    if (segment === '.' || segment === '') {
      continue
    }

    if (segment === '..') {
      resolvedSegments.pop()
      continue
    }

    resolvedSegments.push(segment)
  }

  return normalizeImportSource(resolvedSegments.join('/'))
}

const parseImportSources = (sourceCode: string): string[] => {
  const normalizedSource = stripComments(sourceCode)
  const importSources = new Set<string>()

  const patterns = [
    /(?:import|export)\s+[\s\S]+?\s+from\s*["']([^"']+)["']/g,
    /import\s*["']([^"']+)["']/g,
    /require\s*\(\s*["']([^"']+)["']\s*\)/g,
    /import\s*\(\s*["']([^"']+)["']\s*\)/g,
  ]

  for (const pattern of patterns) {
    for (const match of normalizedSource.matchAll(pattern)) {
      if (match[1]) {
        importSources.add(normalizeImportSource(match[1]))
      }
    }
  }

  return Array.from(importSources)
}

export const scanImports = (
  filePath: string,
  fileContent: string,
): ImportScanResult => {
  const sources = parseImportSources(fileContent)

  const references: ImportReference[] = sources.map((rawSource) => {
    const normalizedSource = normalizeImportSource(rawSource)
    const relative = isRelativeImport(normalizedSource)
    const resolvedPath = relative ? resolveRelativeImportPath(filePath, normalizedSource) : null

    return {
      rawSource,
      normalizedSource,
      isRelative: relative,
      resolvedPath,
    }
  })

  return {
    filePath: normalizeImportSource(filePath),
    references,
  }
}

export const extractImportSources = (fileContent: string): string[] => parseImportSources(fileContent)

export const isImportSourceRelative = (source: string): boolean => isRelativeImport(normalizeImportSource(source))
