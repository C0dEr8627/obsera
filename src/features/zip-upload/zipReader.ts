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
import { useAppStore } from '@/store'
import { analyzeFiles, dependencyScan, generateGraph } from '@/workers/workerClient'
import type { TechStackItem } from '@/features/tech-stack/types'

export interface ZipReadSummary {
  fileCount: number
  ignoredFileCount: number
  sampleFileName: string | null
  sampleFileContent: string | null
  fileTree: FileNode[]
  dependencyGraph: DependencyGraphData
  techStack: TechStackItem[]
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
  const setStage = useAppStore.getState().setStage
  try {
    setStage('extracting', { percent: 5, message: 'Opening archive' })
  } catch {}

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

  const totalFiles = files.length
  for (let i = 0; i < totalFiles; i++) {
    const entry = files[i]
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

    // update parsing progress incrementally
    try {
      const percent = Math.round(30 + ((i + 1) / Math.max(1, totalFiles)) * 35) // 30 -> 65
      setStage('parsing', { percent, message: `Parsing files (${i + 1}/${totalFiles})` })
    } catch {}
  }

  try {
    setStage('generatingGraph', { percent: 65, message: 'Delegating analysis to worker' })
  } catch {}

  let techStack: TechStackItem[] = []
  let dependencyGraph: DependencyGraphData

  try {
    // run dependency scan in worker and stream progress
    await dependencyScan(
      extractedFiles.map((f) => ({ path: f.path, content: f.content })),
      (progress: any) => {
        try {
          setStage('parsing', { percent: progress.percent, message: progress.message })
        } catch {}
      },
    )

    // notify graph generation
    try {
      setStage('generatingGraph', { percent: 60, message: 'Worker: generating graph' })
    } catch {}

    const graphResult = await generateGraph(
      extractedFiles.map((f) => ({ path: f.path, content: f.content })),
      (progress: any) => {
        try {
          setStage('generatingGraph', { percent: progress.percent, message: progress.message })
        } catch {}
      },
    )

    dependencyGraph = graphResult.dependencyGraph

    // detect tech stack inside worker via START_ANALYSIS path or locally
    try {
      const analysis = await analyzeFiles(
        extractedFiles.map((f) => ({ path: f.path, content: f.content })),
        (progress) => {
          try {
            setStage('detectingTechStack', { percent: progress.percent, message: progress.message })
          } catch {}
        },
      )

      techStack = analysis.techStack
    } catch (e) {
      // fallback local detection
      try {
        const detect = await import('@/features/tech-stack/utils/detectTechStack')
        techStack = detect.detectTechStack(extractedFiles as any)
      } catch {
        techStack = []
      }
    }
  } catch (e) {
    try {
      useAppStore.getState().setError(String(e ?? 'Worker analysis failed'))
      setStage('error')
    } catch {}
    // fallback to local processing to remain resilient
    dependencyGraph = buildDependencyGraph(
      extractedFiles.map((file) => ({ path: file.path, content: file.content ?? '' })),
    )
    try {
      // attempt local detection as fallback
      const detect = await import('@/features/tech-stack/utils/detectTechStack')
      techStack = detect.detectTechStack(extractedFiles as any)
    } catch {
      techStack = []
    }
  }

  try {
    setStage('completed', { percent: 100, message: 'Analysis complete' })
  } catch {}

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
    techStack,
  }
}
