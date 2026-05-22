import type { FileNode, FileNodeMetadata } from '@/types/fileNode'

export interface ExtractedFileInput {
  path: string
  content?: string
  metadata?: FileNodeMetadata
}

export interface ExtractedFolderInput {
  path: string
  metadata?: FileNodeMetadata
}

interface BuildFileTreeOptions {
  files: ExtractedFileInput[]
  folders?: ExtractedFolderInput[]
  pruneEmptyFolders?: boolean
}

const normalizeFilePath = (path: string) =>
  path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')

const getPathParts = (path: string) =>
  normalizeFilePath(path).split('/').filter(Boolean)

const getFileExtension = (fileName: string) => {
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex <= 0) {
    return ''
  }

  return fileName.slice(lastDotIndex).toLowerCase()
}

const sortFileTree = (nodes: FileNode[]): FileNode[] =>
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

const removeEmptyFolders = (nodes: FileNode[]): FileNode[] =>
  nodes.reduce<FileNode[]>((filteredNodes, node) => {
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
  siblings: FileNode[],
  name: string,
  path: string,
  metadata?: FileNodeMetadata,
) => {
  const existingFolder = siblings.find(
    (node) => node.type === 'folder' && node.path === path,
  )

  if (existingFolder?.type === 'folder') {
    if (metadata) {
      existingFolder.metadata = {
        ...existingFolder.metadata,
        ...metadata,
      }
    }

    return existingFolder
  }

  const folder = {
    id: path,
    name,
    path,
    type: 'folder',
    metadata,
    children: [],
  } satisfies FileNode

  siblings.push(folder)
  return folder
}

const addFolderToTree = (
  tree: FileNode[],
  folderInput: ExtractedFolderInput,
) => {
  const pathParts = getPathParts(folderInput.path)

  if (pathParts.length === 0) {
    return
  }

  let siblings = tree

  pathParts.forEach((folderName, index) => {
    const folderPath = pathParts.slice(0, index + 1).join('/')
    const folder = findOrCreateFolder(
      siblings,
      folderName,
      folderPath,
      index === pathParts.length - 1 ? folderInput.metadata : undefined,
    )
    siblings = folder.children
  })
}

const addFileToTree = (tree: FileNode[], fileInput: ExtractedFileInput) => {
  const normalizedPath = normalizeFilePath(fileInput.path)
  const pathParts = getPathParts(normalizedPath)

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
    (node) => node.type === 'file' && node.path === normalizedPath,
  )
  const fileNode = {
    id: normalizedPath,
    name: fileName,
    path: normalizedPath,
    type: 'file',
    metadata: {
      extension: getFileExtension(fileName),
      ...fileInput.metadata,
    },
    content: fileInput.content,
  } satisfies FileNode

  if (existingFileIndex >= 0) {
    siblings[existingFileIndex] = fileNode
    return
  }

  siblings.push(fileNode)
}

export const buildFileTree = ({
  files,
  folders = [],
  pruneEmptyFolders = false,
}: BuildFileTreeOptions): FileNode[] => {
  const fileTree: FileNode[] = []

  folders.forEach((folder) => addFolderToTree(fileTree, folder))
  files.forEach((file) => addFileToTree(fileTree, file))

  return sortFileTree(
    pruneEmptyFolders ? removeEmptyFolders(fileTree) : fileTree,
  )
}
