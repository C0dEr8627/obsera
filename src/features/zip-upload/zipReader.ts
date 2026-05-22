import JSZip from 'jszip'
import type { FileTreeNode } from '@/store'

export interface ZipReadSummary {
  fileCount: number
  sampleFileName: string | null
  sampleFileContent: string | null
  fileTree: FileTreeNode[]
}

const normalizeZipPath = (path: string) =>
  path.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')

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
  const folders = Object.values(archive.files).filter(
    (entry) => entry.dir && normalizeZipPath(entry.name),
  )
  const files = Object.values(archive.files).filter(
    (entry) => !entry.dir && normalizeZipPath(entry.name),
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
    sampleFileName: sampleFile?.name ?? null,
    sampleFileContent: sampleFile ? await sampleFile.async('string') : null,
    fileTree: sortFileTree(fileTree),
  }
}
