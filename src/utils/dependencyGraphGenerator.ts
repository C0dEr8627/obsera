import type {
  DependencyGraphEdge,
  DependencyGraphNode,
} from '@/store/slices/dependencyGraphSlice'
import { scanImports } from '@/utils/importScanner'

export interface DependencyGraphData {
  nodes: DependencyGraphNode[]
  edges: DependencyGraphEdge[]
}

const normalizeFilePath = (path: string): string =>
  path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')

const supportedImportExtensions = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.json',
]

const resolveImportTarget = (
  resolvedPath: string,
  filePathSet: Set<string>,
): string | null => {
  const normalizedResolvedPath = normalizeFilePath(resolvedPath)

  if (filePathSet.has(normalizedResolvedPath)) {
    return normalizedResolvedPath
  }

  for (const extension of supportedImportExtensions) {
    const candidate = `${normalizedResolvedPath}${extension}`
    if (filePathSet.has(candidate)) {
      return candidate
    }
  }

  if (!normalizedResolvedPath.endsWith('/index')) {
    for (const extension of supportedImportExtensions) {
      const candidate = `${normalizedResolvedPath}/index${extension}`
      if (filePathSet.has(candidate)) {
        return candidate
      }
    }
  }

  return null
}

export const buildDependencyGraph = (
  files: Array<{ path: string; content: string }>,
): DependencyGraphData => {
  const normalizedFiles = files.map((file) => ({
    path: normalizeFilePath(file.path),
    content: file.content,
  }))

  const filePathSet = new Set(normalizedFiles.map((file) => file.path))

  const nodes: DependencyGraphNode[] = normalizedFiles.map((file) => ({
    id: file.path,
    label: file.path,
    filePath: file.path,
  }))

  const edgeSet = new Set<string>()
  const edges: DependencyGraphEdge[] = []

  for (const file of normalizedFiles) {
    const scanResult = scanImports(file.path, file.content)

    for (const reference of scanResult.references) {
      if (!reference.resolvedPath) {
        continue
      }

      const targetPath = resolveImportTarget(reference.resolvedPath, filePathSet)

      if (!targetPath || targetPath === file.path) {
        continue
      }

      const edgeId = `${file.path}->${targetPath}`
      if (edgeSet.has(edgeId)) {
        continue
      }

      edgeSet.add(edgeId)
      edges.push({
        id: edgeId,
        source: file.path,
        target: targetPath,
      })
    }
  }

  return {
    nodes,
    edges,
  }
}
