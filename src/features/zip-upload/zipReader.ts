import JSZip from 'jszip'
import type { FileTreeNode } from '@/store'

export interface ZipReadSummary {
  fileCount: number
  ignoredFileCount: number
  sampleFileName: string | null
  sampleFileContent: string | null
  fileTree: FileTreeNode[]
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

const sortFileTree = (nodes: FileTreeNode[]): FileTreeNode[] =>
  [...nodes]
    .map((node) =>
      node.type === 'folder'
        ? {
            ...node,
            children: sortFileTree(node.children),
          }
        : node,
    )
    .sort((firstNode, secondNode) => {
      if (firstNode.type !== secondNode.type) {
        return firstNode.type === 'folder' ? -1 : 1
      }

      return firstNode.name.localeCompare(secondNode.name)
    })

const removeEmptyFolders = (nodes: FileTreeNode[]): FileTreeNode[] =>
  nodes.reduce<FileTreeNode[]>((filteredNodes, node) => {
    if (node.type === 'file') {
      filteredNodes.push(node)
      return filteredNodes
    }

    const children = removeEmptyFolders(node.children)

    if (children.length === 0) {
      return filteredNodes
    }

    filteredNodes.push({
      ...node,
      children,
    })

    return filteredNodes
  }, [])

const findOrCreateFolder = (
  siblings: FileTreeNode[],
  name: string,
  path: string,
) => {
  const existingFolder = siblings.find(
    (node) => node.type === 'folder' && node.path === path,
  )

  if (existingFolder?.type === 'folder') {
    return existingFolder
  }

  const folder = {
    id: path,
    name,
    path,
    type: 'folder',
    children: [],
  } satisfies FileTreeNode

  siblings.push(folder)
  return folder
}

const addFileToTree = (tree: FileTreeNode[], path: string, content: string) => {
  const pathParts = path.split('/').filter(Boolean)

  if (pathParts.length === 0) {
    return
  }

  let siblings = tree
  const folders = pathParts.slice(0, -1)

  folders.forEach((folderName, index) => {
    const folderPath = pathParts.slice(0, index + 1).join('/')
    const folder = findOrCreateFolder(siblings, folderName, folderPath)
    siblings = folder.children
  })

  const fileName = pathParts.at(-1)

  if (!fileName) {
    return
  }

  const existingFileIndex = siblings.findIndex(
    (node) => node.type === 'file' && node.path === path,
  )
  const fileNode = {
    id: path,
    name: fileName,
    path,
    type: 'file',
    content,
  } satisfies FileTreeNode

  if (existingFileIndex >= 0) {
    siblings[existingFileIndex] = fileNode
    return
  }

  siblings.push(fileNode)
}

const addFolderToTree = (tree: FileTreeNode[], path: string) => {
  const pathParts = path.split('/').filter(Boolean)

  if (pathParts.length === 0) {
    return
  }

  let siblings = tree

  pathParts.forEach((folderName, index) => {
    const folderPath = pathParts.slice(0, index + 1).join('/')
    const folder = findOrCreateFolder(siblings, folderName, folderPath)
    siblings = folder.children
  })
}

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
  const fileTree: FileTreeNode[] = []

  for (const entry of folders) {
    addFolderToTree(fileTree, normalizeZipPath(entry.name))
  }

  for (const entry of files) {
    const path = normalizeZipPath(entry.name)
    const content = await entry.async('string')
    addFileToTree(fileTree, path, content)
  }

  return {
    fileCount: files.length,
    ignoredFileCount: allFiles.length - files.length,
    sampleFileName: sampleFile?.name ?? null,
    sampleFileContent: sampleFile ? await sampleFile.async('string') : null,
    fileTree: sortFileTree(removeEmptyFolders(fileTree)),
  }
}
