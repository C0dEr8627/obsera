import JSZip from 'jszip'
import type { FileNode } from '@/types/fileNode'
import {
  buildFileTree,
  type ExtractedFileInput,
} from '@/utils/fileTreeGenerator'
import {
  buildDependencyGraph,
  type DependencyGraphData,
} from '@/utils/dependencyGraphGenerator'

export interface ZipReadSummary {
  fileCount: number
  ignoredFileCount: number
  sampleFileName: string | null
  sampleFileContent: string | null
  fileTree: FileNode[]
  dependencyGraph: DependencyGraphData
}

const ignoredDirectoryNames = new Set([
  '__macosx',
  '.git',
  '.hg',
  '.svn',
  '.idea',
  '.vscode',
  '.dart_tool',
  '.gradle',
  '.next',
  '.nuxt',
  '.turbo',
  '.vercel',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
  'target',
])

const ignoredFileNames = new Set([
  '.ds_store',
  'bun.lockb',
  'cargo.lock',
  'composer.lock',
  'desktop.ini',
  'gemfile.lock',
  'package-lock.json',
  'pipfile.lock',
  'pnpm-lock.yaml',
  'poetry.lock',
  'pubspec.lock',
  'thumbs.db',
  'yarn.lock',
])

const ignoredExtensions = new Set([
  '.7z',
  '.a',
  '.apk',
  '.app',
  '.avi',
  '.bin',
  '.bmp',
  '.class',
  '.dll',
  '.dmg',
  '.doc',
  '.docx',
  '.dylib',
  '.eot',
  '.exe',
  '.gif',
  '.gz',
  '.ico',
  '.jar',
  '.jpeg',
  '.jpg',
  '.keystore',
  '.lockb',
  '.mov',
  '.mp3',
  '.mp4',
  '.o',
  '.otf',
  '.pdf',
  '.png',
  '.rar',
  '.so',
  '.sqlite',
  '.sqlite3',
  '.tar',
  '.ttf',
  '.webm',
  '.webp',
  '.woff',
  '.woff2',
  '.zip',
])

const supportedExtensions = new Set([
  '.astro',
  '.c',
  '.conf',
  '.cpp',
  '.cs',
  '.css',
  '.csv',
  '.dart',
  '.env',
  '.go',
  '.graphql',
  '.h',
  '.hpp',
  '.html',
  '.java',
  '.js',
  '.json',
  '.jsx',
  '.kt',
  '.less',
  '.log',
  '.lua',
  '.md',
  '.mdx',
  '.mjs',
  '.php',
  '.plist',
  '.properties',
  '.py',
  '.rb',
  '.rs',
  '.sass',
  '.scss',
  '.sh',
  '.sql',
  '.svelte',
  '.swift',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.vue',
  '.xml',
  '.yaml',
  '.yml',
])

const supportedExtensionlessFileNames = new Set([
  '.env',
  '.env.example',
  '.gitignore',
  '.prettierrc',
  'dockerfile',
  'license',
  'makefile',
  'readme',
])

const normalizeZipPath = (path: string) =>
  path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')

const getPathParts = (path: string) => path.split('/').filter(Boolean)

const getFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex <= 0) {
    return ''
  }

  return fileName.slice(lastDotIndex).toLowerCase()
}

const isIgnoredPath = (path: string) => {
  const pathParts = getPathParts(path).map((part) => part.toLowerCase())
  const fileName = pathParts.at(-1)

  if (!fileName) {
    return true
  }

  return (
    pathParts.some((part) => ignoredDirectoryNames.has(part)) ||
    ignoredFileNames.has(fileName)
  )
}

const isSupportedFilePath = (path: string) => {
  if (isIgnoredPath(path)) {
    return false
  }

  const fileName = getPathParts(path).at(-1)?.toLowerCase()

  if (!fileName) {
    return false
  }

  const extension = getFileExtension(fileName)

  if (ignoredExtensions.has(extension)) {
    return false
  }

  return (
    supportedExtensions.has(extension) ||
    supportedExtensionlessFileNames.has(fileName)
  )
}

const isSupportedFolderPath = (path: string) => !isIgnoredPath(path)

export const readZipSummary = async (file: File): Promise<ZipReadSummary> => {
  const archive = await JSZip.loadAsync(await file.arrayBuffer())
  const folders = Object.values(archive.files).filter((entry) => {
    const path = normalizeZipPath(entry.name)
    return entry.dir && path && isSupportedFolderPath(path)
  })
  const allFiles = Object.values(archive.files).filter((entry) => !entry.dir)
  const files = allFiles.filter((entry) =>
    isSupportedFilePath(normalizeZipPath(entry.name)),
  )
  const sampleFile = files[0] ?? null
  const extractedFiles: ExtractedFileInput[] = []

  for (const entry of files) {
    const path = normalizeZipPath(entry.name)
    const content = await entry.async('string')
    const fileName = getPathParts(path).at(-1) ?? ''

    extractedFiles.push({
      path,
      content,
      metadata: {
        extension: getFileExtension(fileName),
        isText: true,
      },
    })
  }

  const dependencyGraph = buildDependencyGraph(
    extractedFiles.map((file) => ({ path: file.path, content: file.content ?? '' })),
  )

  return {
    fileCount: files.length,
    ignoredFileCount: allFiles.length - files.length,
    sampleFileName: sampleFile?.name ?? null,
    sampleFileContent: sampleFile ? await sampleFile.async('string') : null,
    fileTree: buildFileTree({
      folders: folders.map((entry) => ({
        path: normalizeZipPath(entry.name),
      })),
      files: extractedFiles,
      pruneEmptyFolders: true,
    }),
    dependencyGraph,
  }
}
