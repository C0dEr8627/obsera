export type FileNodeType = 'file' | 'folder'

export interface FileNodeMetadata {
  extension?: string
  isText?: boolean
  size?: number
}

export interface FileNodeBase {
  id: string
  path: string
  name: string
  type: FileNodeType
  metadata?: FileNodeMetadata
}

export interface FileNodeFile extends FileNodeBase {
  type: 'file'
  content?: string
}

export interface FileNodeFolder extends FileNodeBase {
  type: 'folder'
  children: FileNode[]
}

export type FileNode = FileNodeFile | FileNodeFolder

export type FileTreeBaseNode = FileNodeBase
export type FileTreeFileNode = FileNodeFile
export type FileTreeFolderNode = FileNodeFolder
export type FileTreeNode = FileNode
